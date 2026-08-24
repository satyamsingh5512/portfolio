import React from "react";

interface SectionHeadingProps {
  subHeading: string;
  heading: string;
  /** Use "h1" when this is the page's primary heading. */
  as?: "h1" | "h2";
}

export default function SectionHeading({
  subHeading,
  heading,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div>
      <p className="text-secondary text-xs font-medium tracking-wider uppercase sm:text-sm">
        {subHeading}
      </p>
      <Heading className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        {heading}
      </Heading>
    </div>
  );
}
