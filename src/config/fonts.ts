import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

/**
 * Body font. Preloaded because it paints the first contentful text.
 */
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Only used for code blocks on a handful of pages, so it is not preloaded —
 * that keeps an unused font off the critical path of every route.
 */
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/**
 * Heading font (h1–h6). The hero heading is the LCP candidate on the landing
 * page, so this is preloaded: without it the heading repaints late when the
 * font swaps in, which pushes LCP out by ~800 ms.
 */
export const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  display: "swap",
});
