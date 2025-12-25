import { BlogPostPreview } from '@/types/blog';

import { BlogCard } from './BlogCard';

interface BlogListProps {
  posts: BlogPostPreview[];
  className?: string;
}

export function BlogList({ posts, className = '' }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center space-y-3 sm:space-y-4 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold">No blog posts found</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Check back later for new content!
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 ${className}`}>
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
