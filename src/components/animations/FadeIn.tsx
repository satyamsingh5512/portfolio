import { cn } from "@/lib/utils";
import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  /** Stagger hint (seconds in the old API); shifts where the reveal starts. */
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
}

const OFFSETS: Record<
  NonNullable<FadeInProps["direction"]>,
  [number, number]
> = {
  up: [0, 1],
  down: [0, -1],
  left: [1, 0],
  right: [-1, 0],
  none: [0, 0],
};

/**
 * Scroll-triggered fade/slide with no JavaScript at all.
 *
 * This used to be a client component (first Framer Motion, then an
 * IntersectionObserver). The landing page renders ~20 of them, so that was ~20
 * hydrated components and ~20 observers. A scroll-driven CSS animation
 * (`animation-timeline: view()`) does the same job on the compositor.
 *
 * Where `animation-timeline` is unsupported (currently Firefox) the `@supports`
 * guard means no animation runs and the content is simply visible — the correct
 * fallback. Content already inside the viewport on load starts at its final
 * state, so this never delays the largest contentful paint.
 */
export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  distance = 20,
  className = "",
}: FadeInProps) {
  const [x, y] = OFFSETS[direction];

  return (
    <div
      className={cn("reveal", className)}
      style={
        {
          "--reveal-x": `${x * distance}px`,
          "--reveal-y": `${y * distance}px`,
          // Cap the stagger so a late item never waits for most of the scroll.
          "--reveal-start": `${Math.min(Math.round(delay * 30), 30)}%`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
