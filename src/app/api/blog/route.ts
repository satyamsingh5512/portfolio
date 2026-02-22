import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPostModel from "@/lib/models/BlogPost";
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
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
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

    // Word-count based reading time
    const text: string =
      typeof content === "object" && content !== null
        ? JSON.stringify(content)
        : String(content ?? "");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

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
      author: author ?? {
        name: session.user.name ?? "Admin",
        email: session.user.email ?? "",
      },
    });

    return NextResponse.json({ slug: post.slug }, { status: 201 });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
