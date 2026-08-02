import { authOptions } from "@/lib/auth";
import BlogPostModel from "@/lib/models/BlogPost";
import ShortLinkModel from "@/lib/models/ShortLink";
import { connectToDatabase } from "@/lib/mongodb";
import { docToShortLinkData, generateUniqueCode } from "@/lib/short-links";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const requestSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/i, "Invalid blog slug"),
});

/**
 * POST /api/admin/short-links/blog — mints (or returns the existing) short code
 * for a blog post. Idempotent, so the admin UI can call it as a plain
 * "get short link" action the way Google Forms does.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "A valid blog slug is required" },
        { status: 400 },
      );
    }
    const { slug } = parsed.data;

    const post = await BlogPostModel.findOne({ slug })
      .select("slug title description tags")
      .lean<{
        slug: string;
        title: string;
        description?: string;
        tags?: string[];
      }>();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existing = await ShortLinkModel.findOne({
      kind: "blog",
      blogSlug: slug,
    }).lean();

    if (existing) {
      return NextResponse.json(
        docToShortLinkData(existing as unknown as Record<string, unknown>),
      );
    }

    const created = await ShortLinkModel.create({
      code: await generateUniqueCode(),
      url: `/blog/${slug}`,
      kind: "blog",
      blogSlug: slug,
      title: post.title,
      description: post.description,
      tags: post.tags ?? [],
      isActive: true,
    });

    return NextResponse.json(
      docToShortLinkData(
        created.toObject() as unknown as Record<string, unknown>,
      ),
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to create blog short link:", err);
    return NextResponse.json(
      { error: "Failed to create short link" },
      { status: 500 },
    );
  }
}
