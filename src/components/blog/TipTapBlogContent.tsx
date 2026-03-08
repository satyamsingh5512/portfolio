import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IBlogPost } from "@/lib/models/BlogPost";
import { Clock } from "lucide-react";
import Image from "next/image";

import Calender from "../svgs/Calender";
import { BlogViewCounter } from "./BlogViewCounter";

interface TipTapBlogContentProps {
  post: IBlogPost & { createdAt: Date; updatedAt: Date };
  slug: string;
  initialViews?: number;
}

export function TipTapBlogContent({
  post,
  slug,
  initialViews = 0,
}: TipTapBlogContentProps) {
  const {
    title,
    description,
    image,
    tags,
    readingTime,
    author,
    contentHTML,
    createdAt,
    updatedAt,
  } = post;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedUpdatedAt =
    updatedAt && updatedAt.getTime() !== createdAt.getTime()
      ? new Date(updatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

  return (
    <article className="mx-auto w-full max-w-3xl min-w-0 sm:max-w-4xl">
      {/* Hero Section */}
      <header className="mb-6 space-y-4 sm:mb-8 sm:space-y-5">
        {image && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg sm:aspect-video sm:rounded-xl">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs sm:text-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-xl leading-tight font-bold sm:text-2xl md:text-3xl lg:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              {description}
            </p>
          )}

          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Calender className="size-4 sm:size-5" />
              <time dateTime={createdAt.toISOString()}>{formattedDate}</time>
            </div>
            {formattedUpdatedAt && (
              <span className="text-xs">(Updated: {formattedUpdatedAt})</span>
            )}
            {readingTime !== undefined && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="size-3.5 sm:size-4" />
                <span>{readingTime} min read</span>
              </div>
            )}
            <BlogViewCounter slug={slug} initialViews={initialViews} />
          </div>

          {/* Author */}
          {author && (
            <div className="flex items-center gap-3 pt-3 sm:gap-4 sm:pt-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium sm:text-base">
                  {author.name}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-4 sm:my-5" />
      </header>

      {/* TipTap-rendered HTML */}
      <div
        className="prose prose-neutral dark:prose-invert max-w-none min-w-0 text-sm break-words sm:text-base [&_img]:h-auto [&_img]:max-w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: contentHTML ?? "" }}
      />
    </article>
  );
}
