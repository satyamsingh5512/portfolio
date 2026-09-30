/**
 * Read side of the admin-managed collections (experiences, achievements,
 * projects), shared by the public pages, the admin dashboard and the admin API.
 *
 * Fallback rule: an empty collection shows the static src/config data *until*
 * the admin first creates/edits/deletes something in it. After that the DB is
 * authoritative, so deleting the last entry really empties the section instead
 * of resurrecting the config defaults. If the DB is unreachable we also fall
 * back to config so the public site never renders blank.
 */
import { certificates as configCertificates } from "@/config/Achievements";
import {
  type Experience,
  experiences as configExperiences,
} from "@/config/Experience";
import { projects as configProjects } from "@/config/Projects";
import AchievementModel from "@/lib/models/Achievement";
import ExperienceModel from "@/lib/models/Experience";
import ProjectModel from "@/lib/models/Project";
import SiteSetting from "@/lib/models/SiteSetting";
import { connectToDatabase } from "@/lib/mongodb";
import type { ProjectRecord } from "@/lib/supabase";
import { cache } from "react";

export type ManagedCollection = "experiences" | "achievements" | "projects";

const managedKey = (collection: ManagedCollection) => `managed:${collection}`;

/** Call after any successful admin mutation of `collection`. */
export async function markCollectionManaged(
  collection: ManagedCollection,
): Promise<void> {
  await SiteSetting.updateOne(
    { key: managedKey(collection) },
    { $set: { value: true } },
    { upsert: true },
  );
}

/** Returns DB rows, or `null` when the caller should use its config fallback. */
async function resolveCollection<T>(
  collection: ManagedCollection,
  load: () => Promise<T[]>,
): Promise<T[] | null> {
  try {
    await connectToDatabase();
    const rows = await load();
    if (rows.length > 0) return rows;
    const managed = await SiteSetting.exists({ key: managedKey(collection) });
    return managed ? [] : null;
  } catch (err) {
    console.error(`Failed to load ${collection} from MongoDB:`, err);
    return null;
  }
}

function toIso(value: unknown): string {
  const date = value ? new Date(value as string) : new Date();
  return Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString();
}

export function slugifyProjectTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ─── Experiences ─────────────────────────────────────────────────────────────

export interface ExperienceRecord extends Experience {
  createdAt: string;
}

export function experienceFromDoc(
  doc: Record<string, unknown>,
): ExperienceRecord {
  return {
    id: String(doc._id),
    company: String(doc.company ?? ""),
    position: String(doc.position ?? ""),
    startDate: String(doc.start_date ?? ""),
    endDate: String(doc.end_date ?? ""),
    isCurrent: Boolean(doc.is_current),
    description: (doc.description as string[]) || [],
    technologies: (doc.technologies as string[]) || [],
    location: String(doc.location ?? ""),
    companyUrl: (doc.company_url as string) || undefined,
    logo: (doc.logo as string) || undefined,
    createdAt: toIso(doc.createdAt),
  };
}

function dateValue(value: string | undefined): number {
  const time = value ? Date.parse(value) : NaN;
  return Number.isNaN(time) ? -Infinity : time;
}

/** Current roles first, then most recent start date, then newest entry. */
export function sortExperiences<T extends Experience & { createdAt?: string }>(
  list: T[],
): T[] {
  return [...list].sort(
    (a, b) =>
      Number(b.isCurrent) - Number(a.isCurrent) ||
      dateValue(b.startDate) - dateValue(a.startDate) ||
      dateValue(b.createdAt) - dateValue(a.createdAt),
  );
}

export async function getAllExperienceRecords(): Promise<ExperienceRecord[]> {
  await connectToDatabase();
  const docs = await ExperienceModel.find({}).lean();
  return sortExperiences(
    (docs as unknown as Record<string, unknown>[]).map(experienceFromDoc),
  );
}

export const getSiteExperiences = cache(async (): Promise<Experience[]> => {
  const rows = await resolveCollection("experiences", getAllExperienceRecords);
  return rows ?? sortExperiences(configExperiences);
});

// ─── Achievements / certificates ─────────────────────────────────────────────

export interface Certificate {
  file: string;
  title: string;
  issuer: string;
  date: string;
}

export interface AchievementRecord extends Certificate {
  id: string;
  createdAt: string;
}

export function achievementFromDoc(
  doc: Record<string, unknown>,
): AchievementRecord {
  return {
    id: String(doc._id),
    title: String(doc.title ?? ""),
    issuer: String(doc.issuer ?? ""),
    date: String(doc.date ?? ""),
    file: String(doc.file ?? ""),
    createdAt: toIso(doc.createdAt),
  };
}

export async function getAllAchievementRecords(): Promise<AchievementRecord[]> {
  await connectToDatabase();
  const docs = await AchievementModel.find({}).lean();
  return (docs as unknown as Record<string, unknown>[])
    .map(achievementFromDoc)
    .sort(
      (a, b) =>
        dateValue(b.date) - dateValue(a.date) ||
        dateValue(b.createdAt) - dateValue(a.createdAt),
    );
}

export const getSiteCertificates = cache(async (): Promise<Certificate[]> => {
  const rows = await resolveCollection(
    "achievements",
    getAllAchievementRecords,
  );
  return rows ?? configCertificates;
});

// ─── Projects ────────────────────────────────────────────────────────────────

export function projectFromDoc(doc: Record<string, unknown>): ProjectRecord {
  const title = String(doc.title ?? "");
  return {
    id: String(doc._id),
    title,
    shortDescription: String(doc.short_description ?? ""),
    description: String(doc.description ?? ""),
    technologies: (doc.technologies as string[]) || [],
    githubUrl: (doc.github_url as string) || undefined,
    liveUrl: (doc.live_url as string) || undefined,
    image: (doc.image as string) || undefined,
    featured: Boolean(doc.featured),
    status: (doc.status as ProjectRecord["status"]) || "completed",
    startDate: (doc.start_date as string) || undefined,
    endDate: (doc.end_date as string) || undefined,
    category: (doc.category as string) || undefined,
    orderIndex: Number(doc.order_index ?? 0),
    createdAt: toIso(doc.createdAt),
    updatedAt: toIso(doc.updatedAt),
    projectDetailsPageSlug: `/projects/${slugifyProjectTitle(title)}`,
  };
}

export async function getAllProjectRecords(): Promise<ProjectRecord[]> {
  await connectToDatabase();
  const docs = await ProjectModel.find({})
    .sort({ order_index: 1, createdAt: -1 })
    .lean();
  return (docs as unknown as Record<string, unknown>[]).map(projectFromDoc);
}

/** `null` = the DB has never been used for projects; render src/config. */
export const getSiteProjects = cache(
  async (): Promise<ProjectRecord[] | null> =>
    resolveCollection("projects", getAllProjectRecords),
);

/** DB project whose title slugifies to `slug`, if any. */
export async function getSiteProjectBySlug(
  slug: string,
): Promise<ProjectRecord | null> {
  const projects = await getSiteProjects();
  return (
    projects?.find(
      (project) => project.projectDetailsPageSlug === `/projects/${slug}`,
    ) ?? null
  );
}

// ─── Taking over the built-in config entries ─────────────────────────────────

export async function isCollectionManaged(
  collection: ManagedCollection,
): Promise<boolean> {
  await connectToDatabase();
  return Boolean(await SiteSetting.exists({ key: managedKey(collection) }));
}

/**
 * Copies the src/config entries the public site is currently falling back to
 * into MongoDB, so they can be edited from /admin. Refuses to run on a
 * non-empty collection (that would create duplicates).
 */
export async function importConfigDefaults(
  collection: ManagedCollection,
): Promise<number> {
  await connectToDatabase();

  if (collection === "experiences") {
    if (await ExperienceModel.exists({})) return 0;
    await ExperienceModel.insertMany(
      configExperiences.map((e) => ({
        company: e.company,
        position: e.position,
        location: e.location,
        start_date: e.startDate,
        end_date: e.endDate || null,
        description: e.description,
        technologies: e.technologies,
        is_current: e.isCurrent,
        company_url: e.companyUrl,
        logo: e.logo,
      })),
    );
    await markCollectionManaged(collection);
    return configExperiences.length;
  }

  if (collection === "achievements") {
    if (await AchievementModel.exists({})) return 0;
    await AchievementModel.insertMany(
      configCertificates.map(({ title, issuer, date, file }) => ({
        title,
        issuer,
        date,
        file,
      })),
    );
    await markCollectionManaged(collection);
    return configCertificates.length;
  }

  if (await ProjectModel.exists({})) return 0;
  const sorted = [...configProjects].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999),
  );
  await ProjectModel.insertMany(
    sorted.map((p, index) => {
      const link = p.link && p.link !== "#" ? p.link : undefined;
      const isGithub = (url?: string) => Boolean(url?.includes("github.com"));
      return {
        title: p.title,
        short_description:
          p.description.length > 480
            ? `${p.description.slice(0, 480)}…`
            : p.description,
        description: p.description,
        technologies: p.technologies.map((t) => t.name),
        github_url: p.github ?? (isGithub(link) ? link : null),
        live_url: p.live ?? (link && !isGithub(link) ? link : null),
        image: p.image || null,
        featured: index < 4,
        status: "completed" as const,
        order_index: p.order ?? index,
      };
    }),
  );
  await markCollectionManaged(collection);
  return sorted.length;
}
