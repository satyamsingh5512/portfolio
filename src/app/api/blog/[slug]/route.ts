import { authOptions } from "@/lib/auth";
import BlogPostModel from "@/lib/models/BlogPost";
import ShortLinkModel from "@/lib/models/ShortLink";
import { connectToDatabase } from "@/lib/mongodb";
import { revalidatePublicSite } from "@/lib/revalidate";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/** Recursively extract all plain text from a TipTap JSON document. */
function extractTextFromTipTap(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;
  if (n.type === "text" && typeof n.text === "string") return n.text;
  if (Array.isArray(n.content))
    return n.content.map(extractTextFromTipTap).join(" ");
  return "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// ─── GET /api/blog/[slug] — public ───────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    const post = await BlogPostModel.findOne({
      slug,
      isPublished: true,
    }).lean();
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/blog/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
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

    // Recalculate reading time from actual text (not raw JSON) if content changed
    let readingTime: number | undefined;
    if (body.content !== undefined) {
      const plainText =
        typeof body.content === "object" && body.content !== null
          ? extractTextFromTipTap(body.content)
          : String(body.content ?? "");
      const words = plainText.trim().split(/\s+/).filter(Boolean).length;
      readingTime = Math.max(1, Math.ceil(words / 200));
    }

    // Ensure author.email is non-empty (Mongoose 9 rejects empty required strings)
    const updateAuthor = body.author
      ? {
          name: body.author.name || session?.user?.name || "Admin",
          email:
            body.author.email || session?.user?.email || "unknown@portfolio",
        }
      : undefined;

    // Build a safe update object — only fields explicitly managed by the form
    const nextSlug =
      typeof body.slug === "string" && body.slug.trim()
        ? slugify(body.slug)
        : undefined;
    if (body.slug !== undefined && !nextSlug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const updateFields: Record<string, unknown> = {
      title: body.title,
      slug: nextSlug,
      description: body.description ?? "",
      content: body.content,
      contentHTML: body.contentHTML ?? "",
      image: body.image ?? "",
      metaImage: body.metaImage ?? "",
      tags: body.tags ?? [],
      isPublished: body.isPublished ?? false,
      isFeatured: body.isFeatured ?? false,
      ...(readingTime !== undefined ? { readingTime } : {}),
      ...(updateAuthor ? { author: updateAuthor } : {}),
    };
    // Remove keys that are undefined so we don't accidentally unset fields
    Object.keys(updateFields).forEach(
      (k) => updateFields[k] === undefined && delete updateFields[k],
    );

    await connectToDatabase();
    const updated = await BlogPostModel.findOneAndUpdate(
      { slug },
      { $set: updateFields },
      { returnDocument: "after", runValidators: false },
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Renamed: keep the post's short code pointing at the new URL.
    if (nextSlug && nextSlug !== slug) {
      await ShortLinkModel.updateMany(
        { kind: "blog", blogSlug: slug },
        { $set: { blogSlug: nextSlug, url: `/blog/${nextSlug}` } },
      );
    }

    revalidatePublicSite();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/blog/[slug] error:", error);
    const raw = error instanceof Error ? error.message : "";
    if (raw.includes("E11000")) {
      return NextResponse.json(
        { error: "A post with that slug already exists." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
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

    // Drop the post's short code so it can't redirect to a dead page.
    await ShortLinkModel.deleteMany({ kind: "blog", blogSlug: slug });

    revalidatePublicSite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/blog/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
