import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPostModel from "@/lib/models/BlogPost";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

// GET /api/admin/blog — returns ALL posts (published + drafts) for admin dashboard
export async function GET() {
  const session = await checkAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const posts = await BlogPostModel.find({})
      .select("-content -contentHTML")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/admin/blog error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
