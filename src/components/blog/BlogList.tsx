import { BlogPostPreview } from "@/types/blog";

import { BlogCard } from "./BlogCard";

interface BlogListProps {
  posts: BlogPostPreview[];
  className?: string;
}

export function BlogList({ posts, className = "" }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center space-y-3 text-center sm:min-h-[400px] sm:space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl">
          No blog posts found
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Check back later for new content!
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 items-stretch gap-3 sm:gap-4 md:gap-5 lg:grid-cols-2 ${className}`}
    >
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
