"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Stats {
  visitors: {
    value: number;
  };
}

export default function VisitorCount() {
  const pathname = usePathname();
  const [visitors, setVisitors] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const recordVisit = async () => {
      try {
        // POST records the visit (deduped by IP on the server) and returns the
        // up-to-date unique visitor count straight from the database.
        const response = await fetch("/api/visitor-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            referrer: typeof document !== "undefined" ? document.referrer : "",
          }),
        });

        if (response.ok) {
          const data: Stats = await response.json();
          setVisitors(data.visitors.value);
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          setError(errorData.error || "Failed to fetch visitor count");
        }
      } catch (error) {
        console.error("Failed to record visitor:", error);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    recordVisit();
    // Record once per mount; pathname is captured for the initial page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <span className="text-secondary text-xs">Loading visitors...</span>;
  }

  if (error) {
    return <span className="text-secondary text-xs">Visitors: Error</span>;
  }

  if (visitors == null) {
    return <span className="text-secondary text-xs">Visitors: N/A</span>;
  }

  return (
    <span className="text-secondary text-xs">
      {visitors.toLocaleString()} visitors
    </span>
  );
}
