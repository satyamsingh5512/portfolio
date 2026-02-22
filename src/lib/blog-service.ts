import { connectToDatabase } from "@/lib/mongodb";
import BlogModel from "@/lib/models/Blog";

export interface Blog {
  id: string;
  title: string;
  description: string;
  url: string;
  date: string;
}

function docToBlog(doc: Record<string, unknown>): Blog {
  return {
    id: String(doc._id),
    title: String(doc.title ?? ""),
    description: String(doc.description ?? ""),
    url: String(doc.url ?? ""),
    date: String(doc.date ?? ""),
  };
}

export async function getBlogs(): Promise<Blog[]> {
  try {
    await connectToDatabase();
    const data = await BlogModel.find({}).sort({ createdAt: -1 }).lean();
    return (data as unknown as Record<string, unknown>[]).map(docToBlog);
  } catch {
    return [];
  }
}

export async function addBlog(blog: Omit<Blog, "id" | "date">): Promise<Blog> {
  await connectToDatabase();
  const created = await BlogModel.create({
    title: blog.title,
    description: blog.description,
    url: blog.url,
    date: new Date().toISOString(),
  });
  return docToBlog(created.toObject() as unknown as Record<string, unknown>);
}

export async function deleteBlog(id: string): Promise<void> {
  await connectToDatabase();
  await BlogModel.findByIdAndDelete(id);
}
