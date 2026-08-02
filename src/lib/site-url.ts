/**
 * Canonical public origin for this site, with no trailing slash.
 *
 * Used for metadata (canonical/OG URLs) and for building short links — both of
 * which must point at the real domain even while running locally, since they get
 * pasted into tweets, crawlers and previews. Override with NEXT_PUBLIC_URL when
 * running against a preview deployment.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_URL || "https://satym.in"
).replace(/\/$/, "");
