import { getObjectIdOrNull, validationError } from "@/lib/admin-api";
import { authOptions } from "@/lib/auth";
import { addBlog, deleteBlog, getBlogs, updateBlog } from "@/lib/blog-service";
import { revalidatePublicSite } from "@/lib/revalidate";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as z from "zod";

const externalBlogSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(1000),
  url: z
    .string()
    .trim()
    .url()
    .refine((value) => /^https?:\/\//i.test(value), "Must be an http(s) URL"),
});

async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return Boolean(session && session.user.role === "admin");
}

export async function GET() {
  const blogs = await getBlogs();
  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = externalBlogSchema.safeParse(await request.json());
    if (!parsed.success) return validationError("blog", parsed.error);

    const newBlog = await addBlog(parsed.data);
    revalidatePublicSite();
    return NextResponse.json(newBlog, { status: 201 });
  } catch (err) {
    console.error("Failed to create external blog:", err);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!getObjectIdOrNull(id)) {
      return NextResponse.json(
        { error: "Valid blog ID required" },
        { status: 400 },
      );
    }

    const parsed = externalBlogSchema.safeParse(await request.json());
    if (!parsed.success) return validationError("blog", parsed.error);

    const updated = await updateBlog(id!, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    revalidatePublicSite();
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update external blog:", err);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!getObjectIdOrNull(id)) {
      return NextResponse.json(
        { error: "Valid blog ID required" },
        { status: 400 },
      );
    }

    if (!(await deleteBlog(id!))) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    revalidatePublicSite();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete external blog:", err);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
