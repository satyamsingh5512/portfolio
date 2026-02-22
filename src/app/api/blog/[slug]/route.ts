import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPostModel from "@/lib/models/BlogPost";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// ─── GET /api/blog/[slug] — public ───────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    const post = await BlogPostModel.findOne({ slug, isPublished: true }).lean();
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/blog/[slug] error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// ─── PUT /api/blog/[slug] — admin only ───────────────────────────────────────
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();

    // Recalculate reading time if content changed
    let readingTime: number | undefined;
    if (body.content !== undefined) {
      const text =
        typeof body.content === "object" && body.content !== null
          ? JSON.stringify(body.content)
          : String(body.content ?? "");
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      readingTime = Math.max(1, Math.ceil(words / 200));
    }

    await connectToDatabase();
    const updated = await BlogPostModel.findOneAndUpdate(
      { slug },
      { ...body, ...(readingTime !== undefined ? { readingTime } : {}) },
      { new: true },
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/blog/[slug] error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// ─── DELETE /api/blog/[slug] — admin only ────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    await connectToDatabase();
    const deleted = await BlogPostModel.findOneAndDelete({ slug });

    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/blog/[slug] error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 }
    );
  }
}
