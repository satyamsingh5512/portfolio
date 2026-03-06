import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BlogPostPreview } from "@/types/blog";
import { Link } from "next-view-transitions";
import Image from "next/image";

import ArrowRight from "../svgs/ArrowRight";
import Calender from "../svgs/Calender";

interface BlogCardProps {
  post: BlogPostPreview;
}

export function BlogCard({ post }: BlogCardProps) {
  const { slug, frontmatter } = post;
  const { title, description, image, tags, date } = frontmatter;
  const imageSrc = image?.trim() ? image : "/meta/blogs.png";

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="group h-full w-full overflow-hidden border-gray-100 p-0 shadow-none transition-all dark:border-gray-800">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          <Link href={`/blog/${slug}`}>
            <Image src={imageSrc} alt={title} fill className="object-cover" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-2 sm:space-y-3">
          <Link href={`/blog/${slug}`}>
            <h3 className="group-hover:text-primary line-clamp-2 text-base leading-tight font-semibold sm:text-xl">
              {title}
            </h3>
          </Link>
          <p className="text-secondary mt-3 line-clamp-3 text-sm sm:mt-4 sm:text-base">
            {description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 sm:p-6">
        <div className="flex w-full flex-col space-y-2 sm:space-y-3">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] sm:text-xs"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] sm:text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
            <time
              className="text-secondary flex items-center gap-1 text-xs sm:gap-2 sm:text-sm"
              dateTime={date}
            >
              <Calender className="size-3 sm:size-4" /> {formattedDate}
            </time>
            <Link
              href={`/blog/${slug}`}
              className="text-secondary flex items-center justify-end gap-1 text-xs underline-offset-4 hover:underline sm:gap-2 sm:text-sm"
            >
              Read More <ArrowRight className="size-3 sm:size-4" />
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
