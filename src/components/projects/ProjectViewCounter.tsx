"use client";

import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProjectViewCounterProps {
  slug: string;
  initialViews?: number;
}

export function ProjectViewCounter({
  slug,
  initialViews = 0,
}: ProjectViewCounterProps) {
  const [views, setViews] = useState(initialViews);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!slug || hasRequested.current) return;
    hasRequested.current = true;

    const syncViews = async () => {
      try {
        // Use a shared session-scoped visitor ID so the same session is
        // deduplicated across both blog and portfolio views.
        let visitorId = sessionStorage.getItem("blog_visitor_id");
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          sessionStorage.setItem("blog_visitor_id", visitorId);
        }

        // Project views are recorded ONLY in the portfolio collection —
        // they do NOT increment the blog view count.
        const res = await fetch(
          `/api/projects/${encodeURIComponent(slug)}/view`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visitorId }),
          },
        );
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
    <div className="text-muted-foreground flex items-center gap-2">
      <Eye className="size-4" />
      <span className="text-sm">
        {views} {views === 1 ? "view" : "views"}
      </span>
    </div>
  );
}
