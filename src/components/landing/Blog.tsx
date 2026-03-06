import BlogPostModel, { IBlogPost } from "@/lib/models/BlogPost";
import { connectToDatabase } from "@/lib/mongodb";
import { BlogPostPreview } from "@/types/blog";
import { Link } from "next-view-transitions";
import React from "react";

import FadeIn from "../animations/FadeIn";
import { BlogCard } from "../blog/BlogCard";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { Button } from "../ui/button";

type MongoPost = IBlogPost & { createdAt: Date; updatedAt: Date };
const FALLBACK_IMAGE = "/meta/blogs.png";

function toPostPreview(doc: MongoPost): BlogPostPreview {
  return {
    slug: doc.slug,
    frontmatter: {
      title: doc.title,
      description: doc.description ?? "",
      image: doc.image || FALLBACK_IMAGE,
      metaImage: doc.metaImage || undefined,
      tags: doc.tags ?? [],
      date: doc.createdAt
        ? new Date(doc.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: doc.updatedAt
        ? new Date(doc.updatedAt).toISOString()
        : undefined,
      isPublished: doc.isPublished,
      isFeatured: doc.isFeatured,
      readingTime: doc.readingTime,
      author: doc.author,
    },
  };
}

export default async function Blog() {
  let posts: BlogPostPreview[] = [];

  try {
    await connectToDatabase();
    const docs = await BlogPostModel.find({ isPublished: true })
      .select("-content -contentHTML")
      .sort({ createdAt: -1 })
      .limit(2)
      .lean<MongoPost[]>();
    posts = docs.map(toPostPreview);
  } catch (error) {
    console.error("Failed to load landing blog posts:", error);
  }

  return (
    <Container className="mt-12 sm:mt-20">
      <FadeIn>
        <SectionHeading subHeading="Featured" heading="Blogs" />
      </FadeIn>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-2">
        {posts.slice(0, 2).map((post, index) => (
          <FadeIn key={post.slug} delay={index * 0.1 + 0.2}>
            <BlogCard post={post} />
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.4} direction="up" distance={10}>
        <div className="mt-6 flex justify-center sm:mt-8">
          <Button variant="outline" className="text-sm">
            <Link href="/blog">Show all blogs</Link>
          </Button>
        </div>
      </FadeIn>
    </Container>
  );
}
