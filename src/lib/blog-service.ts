import fs from "fs";
import path from "path";

const BLOGS_FILE_PATH = path.join(process.cwd(), "src/data/blogs.json");

export interface Blog {
  id: string;
  title: string;
  description: string;
  url: string;
  date: string;
}

export async function getBlogs(): Promise<Blog[]> {
  try {
    const fileContent = await fs.promises.readFile(BLOGS_FILE_PATH, "utf-8");
    return JSON.parse(fileContent) as Blog[];
  } catch {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

export async function addBlog(blog: Omit<Blog, "id" | "date">): Promise<Blog> {
  const blogs = await getBlogs();
  const newBlog: Blog = {
    ...blog,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  blogs.unshift(newBlog); // Add to beginning
  await fs.promises.writeFile(BLOGS_FILE_PATH, JSON.stringify(blogs, null, 2));

  return newBlog;
}

export async function deleteBlog(id: string): Promise<void> {
  const blogs = await getBlogs();
  const filteredBlogs = blogs.filter((blog) => blog.id !== id);
  await fs.promises.writeFile(
    BLOGS_FILE_PATH,
    JSON.stringify(filteredBlogs, null, 2),
  );
}
