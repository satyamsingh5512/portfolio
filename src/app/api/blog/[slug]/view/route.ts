import BlogPostModel from "@/lib/models/BlogPost";
import BlogViewModel from "@/lib/models/BlogView";
import { connectToDatabase } from "@/lib/mongodb";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;

  return "unknown";
}

function hashIP(ip: string): string {
  const salt = process.env.BLOG_VIEW_SALT || process.env.NEXTAUTH_SECRET || "";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    const postExists = await BlogPostModel.exists({ slug, isPublished: true });
    if (!postExists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const views = await BlogViewModel.countDocuments({ slug });
    return NextResponse.json({ views });
  } catch (error) {
    console.error("GET /api/blog/[slug]/view error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog views" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    const postExists = await BlogPostModel.exists({ slug, isPublished: true });
    if (!postExists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);

    const result = await BlogViewModel.updateOne(
      { slug, ipHash },
      { $setOnInsert: { slug, ipHash } },
      { upsert: true },
    );

    const isNewUniqueView = result.upsertedCount > 0;
    const views = await BlogViewModel.countDocuments({ slug });

    return NextResponse.json({
      views,
      counted: isNewUniqueView,
    });
  } catch (error) {
    console.error("POST /api/blog/[slug]/view error:", error);
    return NextResponse.json(
      { error: "Failed to update blog views" },
      { status: 500 },
    );
  }
}
