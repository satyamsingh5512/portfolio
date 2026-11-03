"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReactLenis = dynamic(() => import("lenis/react"), { ssr: false });

/**
 * Lenis-based inertial scrolling, loaded only where it actually improves the
 * experience: pointer-driven (desktop) viewports. Touch devices keep native
 * scrolling, which is both smoother there and free of the per-frame layout
 * reads that Lenis needs.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
    );

    if (
      !media.matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Wait for the first real scroll so it never competes with page load.
    const onScroll = () => setEnabled(true);
    window.addEventListener("scroll", onScroll, { once: true, passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lenis is rendered as a sibling, never as a wrapper. Wrapping `children`
  // only once enabled changed the element type above the whole app, so React
  // unmounted and remounted every page on the first scroll (blank flash,
  // replayed animations, lost state). In `root` mode Lenis drives the window
  // and shares its instance via a global store, so it needs no children.
  return (
    <>
      {children}
      {enabled ? <ReactLenis root /> : null}
    </>
  );
}
