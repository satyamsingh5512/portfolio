import { BlogComponents } from "@/components/blog/BlogComponents";
import Container from "@/components/common/Container";
import { Separator } from "@/components/ui/separator";
import { generateMetadata as getMetadata } from "@/config/Meta";
import { getJourneyContent } from "@/lib/journey";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";

export const metadata: Metadata = {
  ...getMetadata("/journey"),
  robots: { index: true, follow: true },
};

export default function JourneyPage() {
  const data = getJourneyContent();

  if (!data) {
    return (
      <Container className="py-10 sm:py-16">
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 text-center sm:space-y-4">
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Journey
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-lg">
              No journey content found. Add `src/data/journey/journey.mdx` to
              display content here.
            </p>
          </div>
          <Separator />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-16">
      <div className="space-y-6 sm:space-y-8">
        <div className="space-y-3 text-center sm:space-y-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Journey
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-lg">
            A timeline of my learning, projects, and milestones.
          </p>
        </div>
        <Separator />

        <div className="prose prose-neutral dark:prose-invert max-w-none min-w-0 break-words [&_img]:h-auto [&_img]:max-w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto">
          <MDXRemote source={data.content} components={BlogComponents} />
        </div>
      </div>
    </Container>
  );
}
