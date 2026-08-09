import NotFound from "@/components/common/NotFound";
import { siteConfig } from "@/config/Meta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `Page not found — ${siteConfig.name}`,
  description:
    "The page you are looking for does not exist. It may have been moved, renamed or the link is broken.",
  // A 404 should never be indexed.
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return <NotFound />;
}
