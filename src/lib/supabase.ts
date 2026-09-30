/**
 * supabase.ts  →  Kept as a type/helper module.
 * All Supabase references have been replaced with MongoDB equivalents.
 * Types and helper functions are preserved so existing imports continue to work.
 */

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
  projectDetailsPageSlug?: string;
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
    projectDetailsPageSlug: `/projects/${record.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}`,
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
// SITE SETTINGS — moved to ./site-settings (re-exported for existing imports)
// ============================================

export type {
  AboutSettings,
  CTASettings,
  ContactSettings,
  FooterSettings,
  HeroSettings,
  SiteSettings,
  SocialLink,
} from "./site-settings";

/**
 * @deprecated The project has been migrated to MongoDB.
 * Use connectToDatabase() and the Mongoose models instead.
 */
export function getSupabase(): never {
  throw new Error(
    "getSupabase() is no longer available. The project has migrated to MongoDB.",
  );
}
