import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IBlogPost } from "@/lib/models/BlogPost";
import { Clock } from "lucide-react";
import Image from "next/image";

import Calender from "../svgs/Calender";

interface TipTapBlogContentProps {
  post: IBlogPost & { createdAt: Date; updatedAt: Date };
}

export function TipTapBlogContent({ post }: TipTapBlogContentProps) {
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
    <article className="mx-auto w-full max-w-4xl min-w-0">
      {/* Hero Section */}
      <header className="mb-8 space-y-5 sm:space-y-6">
        {image && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-2xl leading-tight font-bold sm:text-3xl lg:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="text-muted-foreground text-base sm:text-lg">
              {description}
            </p>
          )}

          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calender className="size-5" />
              <time dateTime={createdAt.toISOString()}>{formattedDate}</time>
            </div>
            {formattedUpdatedAt && (
              <span className="text-xs">(Updated: {formattedUpdatedAt})</span>
            )}
            {readingTime !== undefined && (
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>{readingTime} min read</span>
              </div>
            )}
          </div>

          {/* Author */}
          {author && (
            <div className="flex items-center gap-4 pt-4">
              <div className="flex-1">
                <p className="font-medium">{author.name}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />
      </header>

      {/* TipTap-rendered HTML */}
      <div
        className="prose prose-neutral dark:prose-invert max-w-none min-w-0 break-words [&_img]:h-auto [&_img]:max-w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: contentHTML ?? "" }}
      />
    </article>
  );
}
