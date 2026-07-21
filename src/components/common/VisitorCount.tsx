"use client";

import { useEffect, useState } from "react";

interface Stats {
  visitors: {
    value: number;
  };
}

export default function VisitorCount() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const recordVisit = async () => {
      try {
        // Dedupe refreshes within a browser session with a stable id.
        let visitorId = sessionStorage.getItem("site_visitor_id");
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          sessionStorage.setItem("site_visitor_id", visitorId);
        }

        const response = await fetch("/api/visitor-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId,
            path: window.location.pathname,
            referrer: document.referrer || undefined,
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
