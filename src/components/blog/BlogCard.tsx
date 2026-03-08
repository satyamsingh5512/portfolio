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
        <div className="relative aspect-[16/9] overflow-hidden sm:aspect-video">
          <Link href={`/blog/${slug}`}>
            <Image src={imageSrc} alt={title} fill className="object-cover" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 md:px-6">
        <div className="space-y-2 sm:space-y-3">
          <Link href={`/blog/${slug}`}>
            <h3 className="group-hover:text-primary line-clamp-2 text-sm leading-tight font-semibold sm:text-base md:text-lg lg:text-xl">
              {title}
            </h3>
          </Link>
          <p className="text-secondary mt-2 line-clamp-3 text-xs sm:mt-3 sm:text-sm md:text-base">
            {description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 sm:p-4 md:p-6">
        <div className="flex w-full flex-col space-y-2 sm:space-y-3">
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[9px] sm:text-[10px] md:text-xs"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-[9px] sm:text-[10px] md:text-xs"
              >
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 sm:mt-3 sm:gap-3">
            <time
              className="text-secondary flex items-center gap-1 text-[10px] sm:text-xs md:text-sm"
              dateTime={date}
            >
              <Calender className="size-2.5 sm:size-3 md:size-4" />{" "}
              {formattedDate}
            </time>
            <Link
              href={`/blog/${slug}`}
              className="text-secondary flex items-center justify-end gap-1 text-[10px] underline-offset-4 hover:underline sm:text-xs md:text-sm"
            >
              Read More <ArrowRight className="size-2.5 sm:size-3 md:size-4" />
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
