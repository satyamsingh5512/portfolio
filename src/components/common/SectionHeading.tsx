import React from 'react';

interface SectionHeadingProps {
  subHeading: string;
  heading: string;
}

export default function SectionHeading({
  subHeading,
  heading,
}: SectionHeadingProps) {
  return (
    <div>
      <p className="text-secondary text-xs sm:text-sm">{subHeading}</p>
      <h2 className="text-xl sm:text-2xl font-bold">{heading}</h2>
    </div>
  );
}
