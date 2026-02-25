import { getPublishedBlogPosts } from "@/lib/blog";
import { Link } from "next-view-transitions";
import React from "react";

import FadeIn from "../animations/FadeIn";
import { BlogCard } from "../blog/BlogCard";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { Button } from "../ui/button";

export default function Blog() {
  const posts = getPublishedBlogPosts();

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
