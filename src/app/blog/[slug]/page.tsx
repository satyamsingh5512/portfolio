import { BlogList } from "@/components/blog/BlogList";
import { TipTapBlogContent } from "@/components/blog/TipTapBlogContent";
import Container from "@/components/common/Container";
import ArrowLeft from "@/components/svgs/ArrowLeft";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/Meta";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPostModel, { IBlogPost } from "@/lib/models/BlogPost";
import { BlogPostPreview } from "@/types/blog";
import { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

type MongoPost = IBlogPost & { createdAt: Date; updatedAt: Date };

// Map a MongoDB post to BlogPostPreview for the related posts list
function toPostPreview(doc: MongoPost): BlogPostPreview {
  return {
    slug: doc.slug,
    frontmatter: {
      title: doc.title,
      description: doc.description ?? "",
      image: doc.image ?? "",
      metaImage: doc.metaImage,
      tags: doc.tags ?? [],
      date: new Date(doc.createdAt).toISOString(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
      isPublished: doc.isPublished,
      isFeatured: doc.isFeatured,
      readingTime: doc.readingTime,
      author: doc.author,
    },
  };
}

// Generate static paths from MongoDB slugs
export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const posts = await BlogPostModel.find({ isPublished: true }).select("slug").lean();
    return posts.map((p) => ({ slug: (p as { slug: string }).slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const post = await BlogPostModel.findOne({ slug, isPublished: true })
    .select("title description image metaImage")
    .lean<MongoPost>();

  if (!post) return { title: "Post Not Found" };

  const { title, description, metaImage, image } = post;
  const ogImage = metaImage || image || "";

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  await connectToDatabase();

  const post = await BlogPostModel.findOne({ slug, isPublished: true }).lean<MongoPost>();
  if (!post) notFound();

  // Related posts — same tags, excluding current
  const currentTags = post.tags.map((t) => t.toLowerCase());
  const relatedDocs = await BlogPostModel.find({
    isPublished: true,
    slug: { $ne: slug },
    tags: { $in: currentTags },
  })
    .select("-content -contentHTML")
    .sort({ createdAt: -1 })
    .limit(3)
    .lean<MongoPost[]>();

  const relatedPosts = relatedDocs.map(toPostPreview);

  return (
    <>
      <Container className="py-16">
        <div className="space-y-12">
          {/* Back Button */}
          <div>
            <Button variant="ghost" asChild className="group">
              <Link href="/blog" className="flex items-center space-x-2">
                <ArrowLeft className="size-4" />
                <span>Back to Blog</span>
              </Link>
            </Button>
          </div>

          {/* Blog Content */}
          <TipTapBlogContent post={post} />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="space-y-6">
              <Separator />
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Related Posts</h2>
                <BlogList posts={relatedPosts} />
              </div>
            </div>
          )}

          {/* Back to Blog CTA */}
          <div className="text-center">
            <Separator className="mb-8" />
            <Button asChild size="lg">
              <Link href="/blog">View All Blogs</Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
