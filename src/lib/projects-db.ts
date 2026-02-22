"use server";

import { connectToDatabase } from "@/lib/mongodb";
import ProjectModel from "@/lib/models/Project";
import type { ProjectRecord } from "@/lib/supabase";

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

/**
 * Fetch all projects from MongoDB
 */
export async function getProjectsFromDB(): Promise<ProjectRecord[]> {
  try {
    await connectToDatabase();
    const data = await ProjectModel.find({}).sort({ order_index: 1 }).lean();
    return (data as unknown as Record<string, unknown>[]).map(mongoToProjectRecord);
  } catch (err) {
    console.error("Failed to fetch projects from MongoDB:", err);
    return [];
  }
}

/**
 * Fetch featured projects from MongoDB
 */
export async function getFeaturedProjects(): Promise<ProjectRecord[]> {
  try {
    await connectToDatabase();
    const data = await ProjectModel.find({ featured: true }).sort({ order_index: 1 }).lean();
    return (data as unknown as Record<string, unknown>[]).map(mongoToProjectRecord);
  } catch (err) {
    console.error("Failed to fetch featured projects from MongoDB:", err);
    return [];
  }
}

/**
 * Fetch a single project by id
 */
export async function getProjectById(id: string): Promise<ProjectRecord | null> {
  try {
    await connectToDatabase();
    const doc = await ProjectModel.findById(id).lean();
    if (!doc) return null;
    return mongoToProjectRecord(doc as unknown as Record<string, unknown>);
  } catch (err) {
    console.error("Failed to fetch project from MongoDB:", err);
    return null;
  }
}
