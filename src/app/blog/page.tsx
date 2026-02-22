import Container from "@/components/common/Container";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMetadata as getMetadata } from "@/config/Meta";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPostModel, { IBlogPost } from "@/lib/models/BlogPost";
import { getBlogs } from "@/lib/blog-service";
import { BlogPostPreview } from "@/types/blog";
import { Metadata } from "next";
import { Robots } from "next/dist/lib/metadata/types/metadata-types";
import { Suspense } from "react";

import { BlogPageClient } from "./BlogPageClient";

export const generateMetadata = (): Metadata => {
  const metadata = getMetadata("/blog");
  return {
    ...metadata,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      } as Robots["googleBot"],
    },
  };
};

// Map MongoDB document to the BlogPostPreview shape expected by existing UI components
function toPostPreview(doc: IBlogPost & { createdAt: Date; updatedAt: Date }): BlogPostPreview {
  return {
    slug: doc.slug,
    frontmatter: {
      title: doc.title,
      description: doc.description ?? "",
      image: doc.image ?? "",
      metaImage: doc.metaImage,
      tags: doc.tags ?? [],
      date: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
      isPublished: doc.isPublished,
      isFeatured: doc.isFeatured,
      readingTime: doc.readingTime,
      author: doc.author,
    },
  };
}

function BlogPageLoading() {
  return (
    <Container className="py-16">
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-32" />
          <Skeleton className="mx-auto h-6 w-96" />
        </div>

        <Separator />

        {/* Tags Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>

        {/* Blog Posts Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default async function BlogPage() {
  await connectToDatabase();

  const docs = await BlogPostModel.find({ isPublished: true })
    .select("-content -contentHTML")
    .sort({ createdAt: -1 })
    .lean<(IBlogPost & { createdAt: Date; updatedAt: Date })[]>();

  const allPosts = docs.map(toPostPreview);

  // Extract unique sorted tags from published posts
  const tagsSet = new Set<string>();
  allPosts.forEach((p) => p.frontmatter.tags.forEach((t) => tagsSet.add(t.toLowerCase())));
  const allTags = Array.from(tagsSet).sort();

  const externalBlogs = await getBlogs();

  return (
    <Suspense fallback={<BlogPageLoading />}>
      <BlogPageClient
        initialPosts={allPosts}
        initialTags={allTags}
        externalBlogs={externalBlogs}
      />
    </Suspense>
  );
}
