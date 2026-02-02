"use client";

import { BlogList } from "@/components/blog/BlogList";
import Container from "@/components/common/Container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import { Blog } from "@/lib/blog-service";
import { BlogPostPreview } from "@/types/blog";
import { ExternalLink } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface BlogPageClientProps {
  initialPosts: BlogPostPreview[];
  initialTags: string[];
  externalBlogs: Blog[];
}

const getBlogPostsByTagClient = (
  posts: BlogPostPreview[],
  tag: string,
): BlogPostPreview[] => {
  return posts.filter((post) =>
    post.frontmatter.tags.some(
      (postTag) => postTag.toLowerCase() === tag.toLowerCase(),
    ),
  );
};

export function BlogPageClient({
  initialPosts,
  initialTags,
  externalBlogs,
}: BlogPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { triggerHaptic, isMobile } = useHapticFeedback();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);

  // Get tag from URL params on mount
  useEffect(() => {
    const tagParam = searchParams.get("tag");
    if (tagParam) {
      setSelectedTag(tagParam);
      const filtered = getBlogPostsByTagClient(initialPosts, tagParam);
      setFilteredPosts(filtered);
    } else {
      setSelectedTag(null);
      setFilteredPosts(initialPosts);
    }
  }, [searchParams, initialPosts]);

  // Handle tag click
  const handleTagClick = (tag: string) => {
    if (isMobile()) {
      triggerHaptic("light");
    }

    if (selectedTag === tag) {
      setSelectedTag(null);
      setFilteredPosts(initialPosts);
      router.replace("/blog");
    } else {
      setSelectedTag(tag);
      const filtered = getBlogPostsByTagClient(initialPosts, tag);
      setFilteredPosts(filtered);
      router.replace(`/blog?tag=${encodeURIComponent(tag)}`);
    }
  };

  const getTagPostCount = (tag: string) => {
    return initialPosts.filter((post) =>
      post.frontmatter.tags.some(
        (postTag) => postTag.toLowerCase() === tag.toLowerCase(),
      ),
    ).length;
  };

  return (
    <Container className="py-10 sm:py-16">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center sm:space-y-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Blogs
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-lg">
            Thoughts, tutorials, and insights on engineering, and programming.
          </p>
        </div>

        <Separator />

        {/* Tags */}
        {initialTags.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold sm:text-lg">
                Popular Tags
              </h2>
              {selectedTag && (
                <button
                  onClick={() => handleTagClick(selectedTag)}
                  className="text-muted-foreground hover:text-foreground text-xs underline sm:text-sm"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {initialTags.map((tag) => {
                const postCount = getTagPostCount(tag);
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="transition-colors"
                  >
                    <Badge
                      variant={isSelected ? "default" : "outline"}
                      className="hover:bg-accent hover:text-accent-foreground tag-inner-shadow cursor-pointer text-[10px] capitalize sm:text-xs"
                    >
                      {tag} ({postCount})
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* External Blogs Section */}
        {externalBlogs.length > 0 && !selectedTag && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold sm:text-2xl">
                External Articles
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {externalBlogs.map((blog) => (
                <a
                  key={blog.id}
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <Card className="hover:bg-muted/50 h-full transition-colors">
                    <CardContent className="flex h-full flex-col gap-2 p-6">
                      <h3 className="line-clamp-2 text-lg leading-tight font-semibold">
                        {blog.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 text-sm">
                        {blog.description}
                      </p>
                      <div className="mt-auto flex items-center pt-2 text-xs font-medium text-blue-500">
                        Read on {new URL(blog.url).hostname}{" "}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>

            <Separator />
          </div>
        )}

        {/* Regular Blog Posts */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold sm:text-2xl">
              {selectedTag ? `Posts tagged "${selectedTag}"` : "Latest Posts"}
              {filteredPosts.length > 0 && (
                <span className="text-muted-foreground ml-2 text-xs font-normal sm:text-sm">
                  ({filteredPosts.length}{" "}
                  {filteredPosts.length === 1 ? "post" : "posts"})
                </span>
              )}
            </h2>
          </div>

          <BlogList posts={filteredPosts} />
        </div>
      </div>
    </Container>
  );
}
