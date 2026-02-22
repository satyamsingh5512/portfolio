/**
 * scripts/migrate-mdx-to-mongo.ts
 *
 * One-time migration: reads all .mdx files from src/data/blog/ and
 * inserts them as BlogPost documents in MongoDB.
 *
 * Run:
 *   bun --env-file=.env.local scripts/migrate-mdx-to-mongo.ts
 * or:
 *   npx ts-node --project tsconfig.json scripts/migrate-mdx-to-mongo.ts
 */

import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import mongoose from "mongoose";

// ─── Inline BlogPost schema (avoids Next.js module resolution issues) ─────────
interface IBlogPost {
  title: string;
  slug: string;
  description?: string;
  content?: Record<string, unknown>;
  contentHTML?: string;
  image?: string;
  metaImage?: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  readingTime?: number;
  author: { name: string; email: string };
}

const BlogPostSchema = new mongoose.Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    content: { type: mongoose.Schema.Types.Mixed },
    contentHTML: String,
    image: String,
    metaImage: String,
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    readingTime: Number,
    author: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true },
);

const BlogPostModel =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Wrap raw MDX content in a minimal TipTap JSON document */
function wrapMdxInTipTap(rawContent: string): Record<string, unknown> {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: rawContent.trim(),
          },
        ],
      },
    ],
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function migrate() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌  MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  console.log("🔌  Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI, { dbName: "portfolio" });
  console.log("✅  Connected\n");

  const blogDir = path.join(__dirname, "../src/data/blog");

  if (!fs.existsSync(blogDir)) {
    console.warn("⚠️   src/data/blog directory not found — nothing to migrate.");
    await mongoose.disconnect();
    return;
  }

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

  if (files.length === 0) {
    console.log("ℹ️   No .mdx files found in src/data/blog.");
    await mongoose.disconnect();
    return;
  }

  console.log(`📄  Found ${files.length} MDX file(s)\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(blogDir, file);

    try {
      // Check if already exists in MongoDB
      const existing = await BlogPostModel.findOne({ slug }).lean();
      if (existing) {
        console.log(`⏭️   [skip]    ${slug} — already in DB`);
        skipped++;
        continue;
      }

      const raw = fs.readFileSync(filePath, "utf8");
      const { data: frontmatter, content: rawContent } = matter(raw);

      const readingTime = calculateReadingTime(rawContent);
      const tipTapJson = wrapMdxInTipTap(rawContent);
      const contentHTML = `<p>${rawContent.replace(/\n/g, "<br/>")}</p>`;

      await BlogPostModel.create({
        title: String(frontmatter.title ?? slug),
        slug,
        description: frontmatter.description ? String(frontmatter.description) : "",
        content: tipTapJson,
        contentHTML,
        image: frontmatter.image ? String(frontmatter.image) : "",
        metaImage: frontmatter.metaImage ? String(frontmatter.metaImage) : undefined,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [],
        isPublished: Boolean(frontmatter.isPublished ?? false),
        isFeatured: Boolean(frontmatter.isFeatured ?? false),
        readingTime,
        author: {
          name: frontmatter.author?.name
            ? String(frontmatter.author.name)
            : "Admin",
          email: frontmatter.author?.email
            ? String(frontmatter.author.email)
            : "",
        },
      });

      console.log(`✅  [created]  ${slug}`);
      created++;
    } catch (err) {
      console.error(
        `❌  [failed]   ${slug} —`,
        err instanceof Error ? err.message : err,
      );
      failed++;
    }
  }

  console.log(
    `\n📊  Migration complete — created: ${created}, skipped: ${skipped}, failed: ${failed}`,
  );

  await mongoose.disconnect();
  console.log("🔌  Disconnected from MongoDB");
}

migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
