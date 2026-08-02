import ShortLinkModel, { type ShortLinkKind } from "@/lib/models/ShortLink";
import { SITE_URL } from "@/lib/site-url";
import { randomInt } from "crypto";

/**
 * Base62 alphabet. 4 characters ≈ 14.7M combinations, 5 ≈ 916M — plenty of
 * headroom while keeping the shortened URL as tight as possible.
 */
const ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const CODE_MIN_LENGTH = 4;
export const CODE_MAX_LENGTH = 5;
export const CODE_PATTERN = /^[0-9a-zA-Z]{4,5}$/;

/**
 * Codes are served from the site root, so they must never shadow a real route
 * (or a well-known file). Compare lowercased.
 */
export const RESERVED_CODES = new Set(
  [
    // App routes
    "api",
    "admin",
    "blog",
    "cp",
    "contact",
    "demo",
    "gears",
    "home",
    "journey",
    "maintenance",
    "projects",
    "resume",
    "setup",
    "work",
    // Framework / static
    "next",
    "icon",
    "img",
    "logo",
    "meta",
    "null",
    "auth",
    "docs",
    "feed",
    "file",
    "font",
    "help",
    "link",
    "post",
    "rss",
    "site",
    "tags",
    "user",
    // Reserved for future use / avoid confusion
    "go",
    "l",
    "s",
    "u",
    "r",
    "new",
    "edit",
    "test",
  ].map((value) => value.toLowerCase()),
);

export function isReservedCode(code: string): boolean {
  return RESERVED_CODES.has(code.toLowerCase());
}

export function generateCode(length: number = CODE_MIN_LENGTH): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[randomInt(ALPHABET.length)];
  }
  return out;
}

/**
 * Generates a code that is not reserved and not already taken. Starts at 4
 * characters and widens to 5 if the shorter space keeps colliding.
 */
export async function generateUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const length = attempt < 8 ? CODE_MIN_LENGTH : CODE_MAX_LENGTH;
    const code = generateCode(length);
    if (isReservedCode(code)) continue;
    const exists = await ShortLinkModel.exists({ code });
    if (!exists) return code;
  }
  throw new Error("Could not allocate a unique short code");
}

/**
 * Validates a destination URL: http(s) only, and never a link back into our own
 * short-link space (which would create a redirect loop).
 */
export function validateDestination(raw: string): {
  ok: boolean;
  url?: string;
  error?: string;
} {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return { ok: false, error: "Enter a full URL including https://" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are supported" };
  }

  try {
    const site = new URL(SITE_URL);
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (
      parsed.host === site.host &&
      segments.length === 1 &&
      CODE_PATTERN.test(segments[0])
    ) {
      return { ok: false, error: "That URL is already a short link" };
    }
  } catch {
    // Ignore a malformed SITE_URL and skip the loop check.
  }

  return { ok: true, url: parsed.toString() };
}

export interface ShortLinkData {
  id: string;
  code: string;
  url: string;
  kind: ShortLinkKind;
  blogSlug?: string;
  title?: string;
  description?: string;
  tags: string[];
  isActive: boolean;
  expiresAt?: string | null;
  views: number;
  clicks: number;
  lastClickedAt?: string | null;
  createdAt: string;
}

function toIso(value: unknown): string | null {
  if (!value) return null;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function docToShortLinkData(
  doc: Record<string, unknown>,
): ShortLinkData {
  return {
    id: String(doc._id),
    code: String(doc.code ?? ""),
    url: String(doc.url ?? ""),
    kind: (doc.kind as ShortLinkKind) === "blog" ? "blog" : "external",
    blogSlug: (doc.blogSlug as string) || undefined,
    title: (doc.title as string) || undefined,
    description: (doc.description as string) || undefined,
    tags: (doc.tags as string[]) || [],
    isActive: doc.isActive !== false,
    expiresAt: toIso(doc.expiresAt),
    views: Number(doc.views ?? 0),
    clicks: Number(doc.clicks ?? 0),
    lastClickedAt: toIso(doc.lastClickedAt),
    createdAt: toIso(doc.createdAt) ?? new Date().toISOString(),
  };
}
