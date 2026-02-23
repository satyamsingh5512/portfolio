import { authOptions } from "@/lib/auth";
import BlogPostModel from "@/lib/models/BlogPost";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Recursively extract all plain text from a TipTap JSON document. */
function extractTextFromTipTap(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;
  if (n.type === "text" && typeof n.text === "string") return n.text;
  if (Array.isArray(n.content))
    return n.content.map(extractTextFromTipTap).join(" ");
  return "";
}

// ─── GET /api/blog — public, returns published posts (no content/contentHTML) ──
export async function GET() {
  try {
    await connectToDatabase();
    const posts = await BlogPostModel.find({ isPublished: true })
      .select("-content -contentHTML")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

// ─── POST /api/blog — admin only, create post ─────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug: rawSlug,
      description,
      content,
      contentHTML,
      image,
      metaImage,
      tags,
      isPublished,
      isFeatured,
      author,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const slug = rawSlug ? slugify(rawSlug) : slugify(title);

    // Extract plain text for accurate reading-time calculation
    const plainText: string =
      typeof content === "object" && content !== null
        ? extractTextFromTipTap(content)
        : String(content ?? "");
    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    // Always ensure author.email is non-empty (Mongoose 9 rejects empty required strings)
    const resolvedAuthor = {
      name: author?.name || session.user.name || "Admin",
      email: author?.email || session.user.email || "unknown@portfolio",
    };

    await connectToDatabase();

    const post = await BlogPostModel.create({
      title,
      slug,
      description: description ?? "",
      content: content ?? {},
      contentHTML: contentHTML ?? "",
      image: image ?? "",
      metaImage: metaImage ?? "",
      tags: tags ?? [],
      isPublished: isPublished ?? false,
      isFeatured: isFeatured ?? false,
      readingTime,
      author: resolvedAuthor,
    });

    return NextResponse.json({ slug: post.slug }, { status: 201 });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    // Surface duplicate-slug errors with a friendlier message
    const raw = error instanceof Error ? error.message : "";
    const message = raw.includes("E11000")
      ? `A post with that slug already exists. Please use a different title or slug.`
      : raw || "Failed to create post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
