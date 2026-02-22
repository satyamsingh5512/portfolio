import { BlogPostForm, BlogPostFormPayload } from "@/components/admin/BlogPostForm";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPostModel, { IBlogPost } from "@/lib/models/BlogPost";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

interface EditBlogPageProps {
  params: Promise<{ slug: string }>;
}

type MongoPost = IBlogPost & { createdAt: Date; updatedAt: Date };

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const { slug } = await params;
  await connectToDatabase();

  const doc = await BlogPostModel.findOne({ slug }).lean<MongoPost>();
  if (!doc) notFound();

  const initialData: Partial<BlogPostFormPayload> & { slug: string } = {
    slug: doc.slug,
    title: doc.title,
    description: doc.description ?? "",
    content: doc.content as Record<string, unknown>,
    contentHTML: doc.contentHTML ?? "",
    image: doc.image ?? "",
    metaImage: doc.metaImage ?? "",
    tags: doc.tags ?? [],
    isPublished: doc.isPublished,
    isFeatured: doc.isFeatured,
    readingTime: doc.readingTime,
    author: doc.author,
  };

  return (
    <BlogPostForm
      initialData={initialData}
      authorName={session.user.name ?? ""}
      authorEmail={session.user.email ?? ""}
    />
  );
}
