import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { AdminBlogPost } from "@/components/admin/AdminDashboard";
import { authOptions } from "@/lib/auth";
import { getBlogs } from "@/lib/blog-service";
import {
  getAllAchievementRecords,
  getAllExperienceRecords,
  getAllProjectRecords,
  isCollectionManaged,
} from "@/lib/content";
import BlogPostModel, { IBlogPost } from "@/lib/models/BlogPost";
import ShortLinkModel from "@/lib/models/ShortLink";
import { connectToDatabase } from "@/lib/mongodb";
import { type ShortLinkData, docToShortLinkData } from "@/lib/short-links";
import { SITE_URL } from "@/lib/site-url";
import { getSiteSettings } from "@/lib/site-settings";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

/** Admin lists never fall back to config — they show what's in the DB. */
async function safely<T>(
  label: string,
  load: () => Promise<T[]>,
): Promise<T[]> {
  try {
    return await load();
  } catch (err) {
    console.error(`Failed to fetch ${label} from MongoDB:`, err);
    return [];
  }
}

async function getShortLinks(): Promise<ShortLinkData[]> {
  try {
    await connectToDatabase();
    const data = await ShortLinkModel.find({}).sort({ createdAt: -1 }).lean();
    return (data as unknown as Record<string, unknown>[]).map(
      docToShortLinkData,
    );
  } catch (err) {
    console.error("Failed to fetch short links from MongoDB:", err);
    return [];
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  await connectToDatabase();

  // ── MongoDB blog posts (published + drafts) ──────────────────────────────
  type MongoPost = IBlogPost & { createdAt: Date; updatedAt: Date };
  const postDocs = await BlogPostModel.find({})
    .select("-content -contentHTML")
    .sort({ createdAt: -1 })
    .lean<MongoPost[]>();

  const blogPosts: AdminBlogPost[] = postDocs.map((doc) => ({
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    description: doc.description ?? "",
    tags: doc.tags ?? [],
    isPublished: doc.isPublished,
    isFeatured: doc.isFeatured ?? false,
    readingTime: doc.readingTime,
    createdAt: new Date(doc.createdAt).toISOString(),
  }));

  const [
    externalBlogs,
    projects,
    siteSettings,
    achievements,
    experiences,
    shortLinks,
  ] = await Promise.all([
    getBlogs(),
    safely("projects", getAllProjectRecords),
    getSiteSettings(),
    safely("achievements", getAllAchievementRecords),
    safely("experiences", getAllExperienceRecords),
    getShortLinks(),
  ]);

  // Empty + never edited = the public site is rendering src/config entries.
  const [experiencesManaged, achievementsManaged, projectsManaged] =
    await Promise.all(
      (["experiences", "achievements", "projects"] as const).map((c) =>
        isCollectionManaged(c).catch(() => true),
      ),
    );
  const configFallback = {
    experiences: experiences.length === 0 && !experiencesManaged,
    achievements: achievements.length === 0 && !achievementsManaged,
    projects: projects.length === 0 && !projectsManaged,
  };

  return (
    <AdminDashboard
      configFallback={configFallback}
      posts={blogPosts}
      externalBlogs={externalBlogs}
      projects={projects}
      achievements={achievements}
      experiences={experiences}
      siteSettings={siteSettings}
      shortLinks={shortLinks}
      siteUrl={SITE_URL}
      user={session.user}
    />
  );
}
