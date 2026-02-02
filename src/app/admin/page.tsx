import type { AchievementData } from "@/components/admin/AchievementsTab";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { ExperienceData } from "@/components/admin/ExperiencesTab";
import type { QuoteData } from "@/components/admin/QuotesTab";
import { authOptions } from "@/lib/auth";
import { getAllBlogPosts } from "@/lib/blog";
import { getBlogs } from "@/lib/blog-service";
import {
  ProjectRecord,
  getSiteSettings,
  getSupabase,
  projectFromDb,
} from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getProjects(): Promise<ProjectRecord[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(projectFromDb);
  } catch (err) {
    console.error("Failed to fetch projects from Supabase:", err);
    return [];
  }
}

async function getAchievements(): Promise<AchievementData[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(
      (record: {
        id: string;
        title: string;
        issuer: string;
        date: string;
        file: string;
        created_at: string;
      }) => ({
        id: record.id,
        title: record.title,
        issuer: record.issuer,
        date: record.date,
        file: record.file,
        createdAt: record.created_at,
      }),
    );
  } catch (err) {
    console.error("Failed to fetch achievements from Supabase:", err);
    return [];
  }
}

async function getExperiences(): Promise<ExperienceData[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(
      (record: {
        id: string;
        company: string;
        title: string;
        location: string;
        start_date: string;
        end_date: string;
        description: string[];
        technologies: string[];
        is_current: boolean;
        company_url?: string;
        logo?: string;
        created_at: string;
      }) => ({
        id: record.id,
        company: record.company,
        position: record.title, // Map title back to position
        startDate: record.start_date,
        endDate: record.end_date,
        isCurrent: record.is_current,
        description: record.description,
        technologies: record.technologies,
        location: record.location,
        companyUrl: record.company_url,
        logo: record.logo,
        createdAt: record.created_at,
      }),
    );
  } catch (err) {
    console.error("Failed to fetch experiences from Supabase:", err);
    return [];
  }
}

async function getQuotes(): Promise<QuoteData[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(
      (record: {
        id: string;
        quote: string;
        author: string;
        created_at: string;
      }) => ({
        id: record.id,
        quote: record.quote,
        author: record.author,
        createdAt: record.created_at,
      }),
    );
  } catch (err) {
    console.error("Failed to fetch quotes from Supabase:", err);
    return [];
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const posts = getAllBlogPosts();
  const externalBlogs = await getBlogs();
  const projects = await getProjects();
  const siteSettings = await getSiteSettings();
  const achievements = await getAchievements();
  const experiences = await getExperiences();
  const quotes = await getQuotes();

  return (
    <AdminDashboard
      posts={posts}
      externalBlogs={externalBlogs}
      projects={projects}
      achievements={achievements}
      experiences={experiences}
      quotes={quotes}
      siteSettings={siteSettings}
      user={session.user}
    />
  );
}
