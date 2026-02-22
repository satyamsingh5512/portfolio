import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function NewBlogPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <BlogPostForm
      authorName={session.user.name ?? ""}
      authorEmail={session.user.email ?? ""}
    />
  );
}
