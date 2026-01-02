export interface BlogAuthor {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  social?: {
    instagram?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  image: string;
  metaImage?: string; // OG image for social sharing
  tags: string[];
  date: string;
  updatedAt?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  readingTime?: number; // in minutes
  slug?: string; // custom slug/permalink
  author?: BlogAuthor;
  canonicalUrl?: string; // for SEO
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

export interface BlogPostPreview {
  slug: string;
  frontmatter: BlogFrontmatter;
}

export interface BlogFormData {
  title: string;
  description: string;
  content: string;
  tags: string[];
  image: string;
  metaImage?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  customSlug?: string;
  author: BlogAuthor;
}
