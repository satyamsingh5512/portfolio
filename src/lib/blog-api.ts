import { BlogFormData, BlogPost } from '@/types/blog';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const blogDirectory = path.join(process.cwd(), 'src/data/blog');

// Ensure blog directory exists
function ensureBlogDirectory() {
  if (!fs.existsSync(blogDirectory)) {
    fs.mkdirSync(blogDirectory, { recursive: true });
  }
}

// Generate slug from title
export function generateSlug(title: string, customSlug?: string): string {
  if (customSlug) {
    return customSlug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Calculate reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Create a new blog post
export async function createBlogPost(data: BlogFormData): Promise<BlogPost> {
  ensureBlogDirectory();
  
  const slug = generateSlug(data.title, data.customSlug);
  const readingTime = calculateReadingTime(data.content);
  const date = new Date().toISOString();
  
  const frontmatter = `---
title: "${data.title.replace(/"/g, '\\"')}"
description: "${data.description.replace(/"/g, '\\"')}"
image: "${data.image}"
${data.metaImage ? `metaImage: "${data.metaImage}"` : ''}
tags: [${data.tags.map(t => `"${t}"`).join(', ')}]
date: "${date}"
isPublished: ${data.isPublished}
isFeatured: ${data.isFeatured || false}
readingTime: ${readingTime}
author:
  name: "${data.author.name}"
  email: "${data.author.email}"
  ${data.author.avatar ? `avatar: "${data.author.avatar}"` : ''}
  ${data.author.bio ? `bio: "${data.author.bio.replace(/"/g, '\\"')}"` : ''}
  ${data.author.social?.instagram ? `social:\n    instagram: "${data.author.social.instagram}"` : ''}
  ${data.author.social?.twitter ? `    twitter: "${data.author.social.twitter}"` : ''}
  ${data.author.social?.github ? `    github: "${data.author.social.github}"` : ''}
  ${data.author.social?.linkedin ? `    linkedin: "${data.author.social.linkedin}"` : ''}
  ${data.author.social?.website ? `    website: "${data.author.social.website}"` : ''}
---

${data.content}`;

  const filePath = path.join(blogDirectory, `${slug}.mdx`);
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    throw new Error(`Blog post with slug "${slug}" already exists`);
  }
  
  fs.writeFileSync(filePath, frontmatter, 'utf8');
  
  return {
    slug,
    frontmatter: {
      title: data.title,
      description: data.description,
      image: data.image,
      metaImage: data.metaImage,
      tags: data.tags,
      date,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      readingTime,
      author: data.author,
    },
    content: data.content,
  };
}

// Update an existing blog post
export async function updateBlogPost(
  slug: string,
  data: Partial<BlogFormData>
): Promise<BlogPost | null> {
  const filePath = path.join(blogDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  // Read existing post
  const { getBlogPostBySlug } = await import('./blog');
  const existingPost = getBlogPostBySlug(slug);
  
  if (!existingPost) {
    return null;
  }
  
  const updatedData = {
    title: data.title || existingPost.frontmatter.title,
    description: data.description || existingPost.frontmatter.description,
    image: data.image || existingPost.frontmatter.image,
    metaImage: data.metaImage || existingPost.frontmatter.metaImage,
    tags: data.tags || existingPost.frontmatter.tags,
    content: data.content || existingPost.content,
    isPublished: data.isPublished ?? existingPost.frontmatter.isPublished,
    isFeatured: data.isFeatured ?? existingPost.frontmatter.isFeatured,
    author: data.author || existingPost.frontmatter.author || {
      name: 'Anonymous',
      email: '',
    },
  };
  
  const readingTime = calculateReadingTime(updatedData.content);
  const updatedAt = new Date().toISOString();
  
  const frontmatter = `---
title: "${updatedData.title.replace(/"/g, '\\"')}"
description: "${updatedData.description.replace(/"/g, '\\"')}"
image: "${updatedData.image}"
${updatedData.metaImage ? `metaImage: "${updatedData.metaImage}"` : ''}
tags: [${updatedData.tags.map(t => `"${t}"`).join(', ')}]
date: "${existingPost.frontmatter.date}"
updatedAt: "${updatedAt}"
isPublished: ${updatedData.isPublished}
isFeatured: ${updatedData.isFeatured || false}
readingTime: ${readingTime}
author:
  name: "${updatedData.author.name}"
  email: "${updatedData.author.email}"
  ${updatedData.author.avatar ? `avatar: "${updatedData.author.avatar}"` : ''}
  ${updatedData.author.bio ? `bio: "${updatedData.author.bio.replace(/"/g, '\\"')}"` : ''}
  ${updatedData.author.social?.instagram ? `social:\n    instagram: "${updatedData.author.social.instagram}"` : ''}
  ${updatedData.author.social?.twitter ? `    twitter: "${updatedData.author.social.twitter}"` : ''}
  ${updatedData.author.social?.github ? `    github: "${updatedData.author.social.github}"` : ''}
  ${updatedData.author.social?.linkedin ? `    linkedin: "${updatedData.author.social.linkedin}"` : ''}
  ${updatedData.author.social?.website ? `    website: "${updatedData.author.social.website}"` : ''}
---

${updatedData.content}`;

  fs.writeFileSync(filePath, frontmatter, 'utf8');
  
  return {
    slug,
    frontmatter: {
      ...existingPost.frontmatter,
      ...updatedData,
      updatedAt,
      readingTime,
    },
    content: updatedData.content,
  };
}

// Delete a blog post
export async function deleteBlogPost(slug: string): Promise<boolean> {
  const filePath = path.join(blogDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  fs.unlinkSync(filePath);
  return true;
}

// Save uploaded image
export async function saveImage(
  file: Buffer,
  filename: string,
  folder: 'blog' | 'meta' = 'blog'
): Promise<string> {
  const publicDir = path.join(process.cwd(), 'public', folder);
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Generate unique filename
  const ext = path.extname(filename);
  const uniqueName = `${uuidv4()}${ext}`;
  const filePath = path.join(publicDir, uniqueName);
  
  fs.writeFileSync(filePath, file);
  
  return `/${folder}/${uniqueName}`;
}
