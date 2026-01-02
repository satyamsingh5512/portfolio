import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BlogFrontmatter } from '@/types/blog';
import rehypeHighlight from '@shikijs/rehype';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

import Calender from '../svgs/Calender';
import { BlogComponents } from './BlogComponents';
import { Clock, Instagram, Twitter, Github, Linkedin, Globe } from 'lucide-react';

interface BlogContentProps {
  frontmatter: BlogFrontmatter;
  content: string;
}

export function BlogContent({ frontmatter, content }: BlogContentProps) {
  const { title, description, image, tags, date, readingTime, author, updatedAt } = frontmatter;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article className="mx-auto max-w-4xl">
      {/* Hero Section */}
      <header className="mb-8 space-y-6">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
            {title}
          </h1>

          <p className="text-xl text-muted-foreground">{description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calender className="size-5" />
              <time dateTime={date}>{formattedDate}</time>
            </div>
            {formattedUpdatedAt && (
              <span className="text-xs">(Updated: {formattedUpdatedAt})</span>
            )}
            {readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>{readingTime} min read</span>
              </div>
            )}
          </div>

          {/* Author Info */}
          {author && (
            <div className="flex items-center gap-4 pt-4">
              {author.avatar && (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{author.name}</p>
                {author.bio && (
                  <p className="text-sm text-muted-foreground">{author.bio}</p>
                )}
              </div>
              {author.social && (
                <div className="flex gap-2">
                  {author.social.instagram && (
                    <a
                      href={`https://instagram.com/${author.social.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Instagram className="size-5" />
                    </a>
                  )}
                  {author.social.twitter && (
                    <a
                      href={`https://twitter.com/${author.social.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="size-5" />
                    </a>
                  )}
                  {author.social.github && (
                    <a
                      href={`https://github.com/${author.social.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="size-5" />
                    </a>
                  )}
                  {author.social.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${author.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="size-5" />
                    </a>
                  )}
                  {author.social.website && (
                    <a
                      href={author.social.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="size-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />
      </header>

      {/* Content */}
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <MDXRemote
          source={content}
          components={BlogComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [
                  rehypeHighlight,
                  {
                    theme: 'github-dark',
                  },
                ],
              ],
            },
          }}
        />
      </div>
    </article>
  );
}
