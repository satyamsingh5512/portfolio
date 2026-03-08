import BlogPostModel from "@/lib/models/BlogPost";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await BlogPostModel.find(
      { isPublished: true },
      { slug: 1, _id: 0 },
    )
      .sort({ createdAt: -1 })
      .lean();
    const slugs = posts.map((post) => post.slug);
    return NextResponse.json({ slugs });
  } catch (error) {
    console.error("GET /api/sitemap error:", error);
    return NextResponse.json({ slugs: [] }, { status: 500 });
  }
}
