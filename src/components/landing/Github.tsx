"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * The contribution calendar sits far below the fold, renders several hundred
 * nodes and fetches its own data, so it is only mounted once it is about to
 * enter the viewport. The reserved height keeps layout shift at zero.
 */
const GithubActivity = dynamic(
  () => import("@/components/landing/GithubActivity"),
  { ssr: false },
);

export default function Github() {
  const sentinel = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || visible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={sentinel} className="min-h-[360px]">
      {visible ? <GithubActivity /> : null}
    </div>
  );
}
