/**
 * Hosts allowed by `images.remotePatterns` in next.config.ts. Keep in sync.
 *
 * Admin users can paste any image URL. next/image throws at render time for a
 * remote host that isn't whitelisted, which would take the whole page down, so
 * such images are rendered with `unoptimized` instead.
 */
const OPTIMIZABLE_HOSTS = new Set([
  "res.cloudinary.com",
  "imagekit.io",
  "i.pinimg.com",
  "cdn.dribbble.com",
  "i.postimg.cc",
  "images-na.ssl-images-amazon.com",
]);

export function canOptimizeImage(src: string | undefined | null): boolean {
  if (!src) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZABLE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}
