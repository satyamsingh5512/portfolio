/**
 * supabase.ts  →  Kept as a type/helper module.
 * All Supabase references have been replaced with MongoDB equivalents.
 * Types and helper functions are preserved so existing imports continue to work.
 */

import { connectToDatabase } from "@/lib/mongodb";
import SiteSetting from "@/lib/models/SiteSetting";

// ============================================
// PROJECTS TYPES
// ============================================

export interface ProjectDBRecord {
  id: string;
  title: string;
  short_description: string;
  description: string;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  image: string | null;
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  start_date: string | null;
  end_date: string | null;
  category: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  startDate?: string;
  endDate?: string;
  category?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export function projectFromDb(record: ProjectDBRecord): ProjectRecord {
  return {
    id: record.id,
    title: record.title,
    shortDescription: record.short_description,
    description: record.description,
    technologies: record.technologies || [],
    githubUrl: record.github_url || undefined,
    liveUrl: record.live_url || undefined,
    image: record.image || undefined,
    featured: record.featured,
    status: record.status,
    startDate: record.start_date || undefined,
    endDate: record.end_date || undefined,
    category: record.category || undefined,
    orderIndex: record.order_index,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function projectToDb(
  project: Omit<ProjectRecord, "id" | "createdAt" | "updatedAt">,
): Omit<ProjectDBRecord, "id" | "created_at" | "updated_at"> {
  return {
    title: project.title,
    short_description: project.shortDescription,
    description: project.description,
    technologies: project.technologies,
    github_url: project.githubUrl || null,
    live_url: project.liveUrl || null,
    image: project.image || null,
    featured: project.featured,
    status: project.status,
    start_date: project.startDate || null,
    end_date: project.endDate || null,
    category: project.category || null,
    order_index: project.orderIndex,
  };
}

// ============================================
// SITE SETTINGS TYPES
// ============================================

export interface HeroSettings {
  name: string;
  title: string;
  avatar: string;
  description: string;
  resumeUrl: string;
  contactUrl: string;
  skills: Array<{ name: string; href: string }>;
}

export interface AboutSettings {
  name: string;
  description: string;
  skills: string[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: "linkedin" | "github" | "email" | "twitter" | "instagram" | "youtube" | "website";
}

export interface ContactSettings {
  title: string;
  description: string;
  email: string;
}

export interface CTASettings {
  profileImage: string;
  preText: string;
  linkText: string;
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

export const defaultSiteSettings: SiteSettings = {
  hero: {
    name: "Satyam",
    title: "Full Stack Developer",
    avatar: "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771769099/portfolio/assets/q0j3puiqnaelv5wp3jhj.jpg",
    description:
      "I am a <b>Full Stack Software Engineer</b> focused on designing and building scalable, production-ready systems.",
    resumeUrl: "/assets/resume.pdf",
    contactUrl: "/contact",
    skills: [
      { name: "React", href: "https://react.dev/" },
      { name: "Next.js", href: "https://nextjs.org/" },
      { name: "Node.js", href: "https://nodejs.org/" },
      { name: "Express", href: "https://expressjs.com/" },
      { name: "PostgreSQL", href: "https://www.postgresql.org/" },
      { name: "MongoDB", href: "https://www.mongodb.com/" },
    ],
  },
  about: {
    name: "Satyam",
    description: "Hey, I'm Satyam. I'm a 3rd-year B.Tech Computer Science student and a Full-Stack Developer with strong Machine Learning expertise.",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "MongoDB", "Next.js"],
  },
  socialLinks: [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/satym5512/", icon: "linkedin" },
    { name: "Github", href: "https://github.com/satyamsingh5512", icon: "github" },
    { name: "Email", href: "mailto:satyamssinghpx@gmail.com", icon: "email" },
  ],
  contact: {
    title: "Contact",
    description: "Get in touch with me. I will get back to you as soon as possible.",
    email: "satyamssinghpx@gmail.com",
  },
  cta: {
    profileImage: "https://res.cloudinary.com/dnuxivxnu/image/upload/v1771769099/portfolio/assets/q0j3puiqnaelv5wp3jhj.jpg",
    preText: "Hey, you scrolled this far, let's talk.",
    linkText: "Book a Free Call",
    calLink: "satyamsinghpx/meeting",
  },
  footer: {
    developer: "Satyam",
    text: "Design & Developed by",
    copyright: "All rights reserved.",
  },
};

// ============================================
// MONGODB-BACKED SITE SETTINGS
// ============================================

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    await connectToDatabase();
    const rows = await SiteSetting.find({
      key: { $in: ["hero", "about", "socialLinks", "contact", "cta", "footer"] },
    }).lean();

    const settings: SiteSettings = { ...defaultSiteSettings };
    for (const row of rows) {
      const key = row.key as keyof SiteSettings;
      if (key in settings && row.value) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (settings as any)[key] = row.value;
      }
    }
    return settings;
  } catch (err) {
    console.error("Failed to fetch site settings from MongoDB:", err);
    return defaultSiteSettings;
  }
}

export async function updateSiteSetting<K extends keyof SiteSettings>(
  key: K,
  value: SiteSettings[K],
): Promise<boolean> {
  try {
    await connectToDatabase();
    await SiteSetting.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, returnDocument: "after" },
    );
    return true;
  } catch (err) {
    console.error("Failed to update site setting in MongoDB:", err);
    return false;
  }
}

/**
 * @deprecated The project has been migrated to MongoDB.
 * Use connectToDatabase() and the Mongoose models instead.
 */
export function getSupabase(): never {
  throw new Error(
    "getSupabase() is no longer available. The project has migrated to MongoDB.",
  );
}
