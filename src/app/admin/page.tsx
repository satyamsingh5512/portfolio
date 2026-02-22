import type { AchievementData } from "@/components/admin/AchievementsTab";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { ExperienceData } from "@/components/admin/ExperiencesTab";
import { authOptions } from "@/lib/auth";
import { getBlogs } from "@/lib/blog-service";
import BlogPostModel, { IBlogPost } from "@/lib/models/BlogPost";
import type { AdminBlogPost } from "@/components/admin/AdminDashboard";
import { connectToDatabase } from "@/lib/mongodb";
import ProjectModel from "@/lib/models/Project";
import AchievementModel from "@/lib/models/Achievement";
import ExperienceModel from "@/lib/models/Experience";
import { ProjectRecord, getSiteSettings } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

function mongoToProjectRecord(doc: Record<string, unknown>): ProjectRecord {
  return {
    id: String(doc._id),
    title: String(doc.title ?? ""),
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
    createdAt: doc.createdAt ? new Date(doc.createdAt as string).toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt as string).toISOString() : new Date().toISOString(),
  };
}

async function getProjects(): Promise<ProjectRecord[]> {
  try {
    await connectToDatabase();
    const data = await ProjectModel.find({}).sort({ createdAt: -1 }).lean();
    return (data as unknown as Record<string, unknown>[]).map(mongoToProjectRecord);
  } catch (err) {
    console.error("Failed to fetch projects from MongoDB:", err);
    return [];
  }
}

async function getAchievements(): Promise<AchievementData[]> {
  try {
    await connectToDatabase();
    const data = await AchievementModel.find({}).sort({ createdAt: -1 }).lean();
    return (data as unknown as Record<string, unknown>[]).map((doc) => ({
      id: String(doc._id),
      title: String(doc.title ?? ""),
      issuer: String(doc.issuer ?? ""),
      date: String(doc.date ?? ""),
      file: String(doc.file ?? ""),
      createdAt: doc.createdAt ? new Date(doc.createdAt as string).toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.error("Failed to fetch achievements from MongoDB:", err);
    return [];
  }
}

async function getExperiences(): Promise<ExperienceData[]> {
  try {
    await connectToDatabase();
    const data = await ExperienceModel.find({}).sort({ createdAt: -1 }).lean();
    return (data as unknown as Record<string, unknown>[]).map((doc) => ({
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
      createdAt: doc.createdAt ? new Date(doc.createdAt as string).toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.error("Failed to fetch experiences from MongoDB:", err);
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

  const externalBlogs = await getBlogs();
  const projects = await getProjects();
  const siteSettings = await getSiteSettings();
  const achievements = await getAchievements();
  const experiences = await getExperiences();

  return (
    <AdminDashboard
      posts={blogPosts}
      externalBlogs={externalBlogs}
      projects={projects}
      achievements={achievements}
      experiences={experiences}
      siteSettings={siteSettings}
      user={session.user}
    />
  );
}
