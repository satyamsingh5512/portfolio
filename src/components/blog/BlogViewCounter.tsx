"use client";

import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BlogViewCounterProps {
  slug: string;
  initialViews?: number;
}

export function BlogViewCounter({
  slug,
  initialViews = 0,
}: BlogViewCounterProps) {
  const [views, setViews] = useState(initialViews);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!slug || hasRequested.current) return;
    hasRequested.current = true;

    const syncViews = async () => {
      try {
        const res = await fetch(`/api/blog/${encodeURIComponent(slug)}/view`, {
          method: "POST",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { views?: number };
        if (typeof data.views === "number") {
          setViews(data.views);
        }
      } catch {
        // Silent fail: keep initial view count
      }
    };

    void syncViews();
  }, [slug]);

  return (
    <div className="flex items-center gap-2">
      <Eye className="size-4" />
      <span>
        {views} {views === 1 ? "view" : "views"}
      </span>
    </div>
  );
}
