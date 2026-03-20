"use client";

import { Eye } from "lucide-react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();

  useEffect(() => {
    if (!slug || hasRequested.current) return;
    hasRequested.current = true;

    const syncViews = async () => {
      try {
        // Use a session-scoped visitor ID so each browser session counts
        // as one unique view, regardless of IP address.
        let visitorId = sessionStorage.getItem("blog_visitor_id");
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          sessionStorage.setItem("blog_visitor_id", visitorId);
        }

        const res = await fetch(`/api/blog/${encodeURIComponent(slug)}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId }),
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

  // Only show view count for admin users
  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Eye className="size-4" />
      <span>
        {views} {views === 1 ? "view" : "views"}
      </span>
    </div>
  );
}
