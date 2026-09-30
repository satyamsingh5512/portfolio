/**
 * Site settings (hero, about, social links, contact, CTA, footer).
 *
 * MongoDB is the source of truth once a section has been saved from /admin.
 * Until then — or if the database is unreachable — every section falls back to
 * the values in src/config, so the public site always renders something sane.
 */
import { about as aboutConfig } from "@/config/About";
import { ctaConfig } from "@/config/CTA";
import { contactConfig } from "@/config/Contact";
import { footerConfig } from "@/config/Footer";
import { heroConfig, socialLinks as heroSocialLinks } from "@/config/Hero";
import SiteSetting from "@/lib/models/SiteSetting";
import { connectToDatabase } from "@/lib/mongodb";
import { cache } from "react";

export interface HeroSettings {
  name: string;
  title: string;
  avatar: string;
  /**
   * Supports `<b>bold</b>` and `{skills:N}`, which inlines skill N (0-based)
   * from `skills` as a linked chip with its icon.
   */
  description: string;
  /** Shows a "Resume" button in the hero when set. */
  resumeUrl: string;
  /** Target of the "Get in touch" button. */
  contactUrl: string;
  skills: Array<{ name: string; href: string }>;
}

export interface AboutHighlight {
  title: string;
  description: string;
}

export interface AboutSettings {
  name: string;
  description: string;
  /** Technology names; icons are resolved by name. */
  skills: string[];
  highlights: AboutHighlight[];
  expertise: string[];
}

export const SOCIAL_ICONS = [
  "linkedin",
  "github",
  "email",
  "twitter",
  "instagram",
  "youtube",
  "website",
] as const;

export interface SocialLink {
  name: string;
  href: string;
  icon: (typeof SOCIAL_ICONS)[number];
}

export interface ContactSettings {
  title: string;
  description: string;
  /** Used by the CTA button when no Cal.com link is configured. */
  email: string;
}

export interface CTASettings {
  profileImage: string;
  preText: string;
  linkText: string;
  /** Cal.com path such as `username/meeting`. Empty = email instead. */
  calLink: string;
}

export interface FooterSettings {
  developer: string;
  text: string;
  copyright: string;
}

export interface SiteSettings {
  hero: HeroSettings;
  about: AboutSettings;
  socialLinks: SocialLink[];
  contact: ContactSettings;
  cta: CTASettings;
  footer: FooterSettings;
}

export const SITE_SETTING_KEYS = [
  "hero",
  "about",
  "socialLinks",
  "contact",
  "cta",
  "footer",
] as const satisfies readonly (keyof SiteSettings)[];

/** Names of the icons rendered in the About "Skills" row before the DB existed. */
const DEFAULT_ABOUT_SKILLS = [
  "React",
  "Bun",
  "JavaScript",
  "TypeScript",
  "MongoDB",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Prisma",
];

const SOCIAL_ICON_BY_NAME: Record<string, SocialLink["icon"]> = {
  linkedin: "linkedin",
  github: "github",
  email: "email",
};

export const defaultSiteSettings: SiteSettings = {
  hero: {
    name: heroConfig.name,
    title: heroConfig.title,
    avatar: heroConfig.avatar,
    description: heroConfig.description.template,
    resumeUrl: "",
    contactUrl: heroConfig.buttons[0]?.href ?? "/contact",
    skills: heroConfig.skills.map(({ name, href }) => ({ name, href })),
  },
  about: {
    name: aboutConfig.name,
    description: aboutConfig.description,
    skills: DEFAULT_ABOUT_SKILLS,
    highlights: aboutConfig.highlights,
    expertise: aboutConfig.expertise,
  },
  // Hero.tsx's social links carry JSX icons; map them to icon keys.
  socialLinks: heroSocialLinks.map(({ name, href }) => ({
    name,
    href,
    icon: SOCIAL_ICON_BY_NAME[name.toLowerCase()] ?? "website",
  })),
  contact: {
    title: contactConfig.title,
    description: contactConfig.description,
    email: ctaConfig.emailAddress,
  },
  cta: {
    profileImage: ctaConfig.profileImage,
    preText: ctaConfig.preText,
    linkText: ctaConfig.linkText,
    calLink: "",
  },
  footer: { ...footerConfig },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Stored values win field-by-field; anything missing (e.g. `highlights` on a
 * document saved before that field existed) falls back to the default.
 */
function mergeSetting<K extends keyof SiteSettings>(
  key: K,
  stored: unknown,
): SiteSettings[K] {
  const fallback = defaultSiteSettings[key];
  if (Array.isArray(fallback)) {
    return (Array.isArray(stored) ? stored : fallback) as SiteSettings[K];
  }
  if (!isPlainObject(stored)) return fallback;

  const merged: Record<string, unknown> = { ...fallback };
  for (const [field, defaultValue] of Object.entries(fallback)) {
    const value = stored[field];
    if (value === undefined || value === null) continue;
    if (Array.isArray(defaultValue) && !Array.isArray(value)) continue;
    merged[field] = value;
  }
  return merged as unknown as SiteSettings[K];
}

async function loadSiteSettings(): Promise<SiteSettings> {
  try {
    await connectToDatabase();
    const rows = await SiteSetting.find({
      key: { $in: SITE_SETTING_KEYS },
    }).lean();

    const settings: SiteSettings = { ...defaultSiteSettings };
    for (const row of rows) {
      const key = row.key as keyof SiteSettings;
      if (key in settings) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (settings as any)[key] = mergeSetting(key, row.value);
      }
    }
    return settings;
  } catch (err) {
    console.error("Failed to fetch site settings from MongoDB:", err);
    return defaultSiteSettings;
  }
}

/** Deduplicated per request: Hero, About, CTA, Footer… all call this. */
export const getSiteSettings = cache(loadSiteSettings);
