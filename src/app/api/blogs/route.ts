import { authOptions } from "@/lib/auth";
import { addBlog, deleteBlog, getBlogs } from "@/lib/blog-service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const blogs = await getBlogs();
  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, url } = body;

    if (!title || !description || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newBlog = await addBlog({ title, description, url });
    return NextResponse.json(newBlog, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
    }

    await deleteBlog(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
