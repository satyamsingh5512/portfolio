import { SupabaseClient, createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate that Supabase credentials are configured
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create Supabase client - singleton pattern
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isConfigured) {
    throw new Error(
      "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    );
  }
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Export the Supabase client directly
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as SupabaseClient);

// ============================================
// PROJECTS TYPES
// ============================================

// Types for the projects table (matches the SQL schema)
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

// App-facing project record type
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

// Helper to convert from DB format to app format
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

// Helper to convert from app format to DB format
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
  skills: Array<{
    name: string;
    href: string;
  }>;
}

export interface AboutSettings {
  name: string;
  description: string;
  skills: string[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon:
    | "linkedin"
    | "github"
    | "email"
    | "twitter"
    | "instagram"
    | "youtube"
    | "website";
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

// Default settings (fallback when DB not configured)
export const defaultSiteSettings: SiteSettings = {
  hero: {
    name: "Satyam",
    title: "Full Stack Developer",
    avatar: "/assets/satyam-avatar.png",
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
    description: `Hey, I'm Satyam. I'm a 3rd-year B.Tech Computer Science student and a Full-Stack Developer with strong Machine Learning expertise.`,
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "Next.js",
    ],
  },
  socialLinks: [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/satym5512/",
      icon: "linkedin",
    },
    {
      name: "Github",
      href: "https://github.com/satyamsingh5512",
      icon: "github",
    },
    { name: "Email", href: "mailto:satyamssinghpx@gmail.com", icon: "email" },
  ],
  contact: {
    title: "Contact",
    description:
      "Get in touch with me. I will get back to you as soon as possible.",
    email: "satyamssinghpx@gmail.com",
  },
  cta: {
    profileImage: "/assets/satyam-avatar.png",
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

// Fetch site settings from Supabase
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from("site_settings")
      .select("key, value")
      .in("key", ["hero", "about", "socialLinks", "contact", "cta", "footer"]);

    if (error) throw error;

    const settings: SiteSettings = { ...defaultSiteSettings };

    for (const row of data || []) {
      const key = row.key as keyof SiteSettings;
      if (key in settings && row.value) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (settings as any)[key] = row.value;
      }
    }

    return settings;
  } catch (err) {
    console.error("Failed to fetch site settings:", err);
    return defaultSiteSettings;
  }
}

// Update a specific setting
export async function updateSiteSetting<K extends keyof SiteSettings>(
  key: K,
  value: SiteSettings[K],
): Promise<boolean> {
  try {
    const client = getSupabase();
    const { error } = await client
      .from("site_settings")
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: "key" },
      );

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to update site setting:", err);
    return false;
  }
}
