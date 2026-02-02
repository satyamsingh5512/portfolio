"use client";

import { useEffect, useState } from "react";

interface Stats {
  pageviews: {
    value: number;
  };
}

export default function VisitorCount() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch("/api/visitor-count");
        if (response.ok) {
          const data: Stats = await response.json();
          setVisitors(data.pageviews.value);
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          setError(errorData.error || "Failed to fetch visitor count");
        }
      } catch (error) {
        console.error("Failed to fetch visitor count:", error);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorCount();
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
