"use server";

import { getSupabase, projectFromDb } from "@/lib/supabase";
import type { ProjectRecord } from "@/lib/supabase";

/**
 * Fetch all projects from Supabase
 */
export async function getProjectsFromDB(): Promise<ProjectRecord[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    return (data || []).map(projectFromDb);
  } catch (err) {
    console.error("Failed to fetch projects from Supabase:", err);
    return [];
  }
}

/**
 * Fetch featured projects from Supabase
 */
export async function getFeaturedProjects(): Promise<ProjectRecord[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching featured projects:", error);
      return [];
    }

    return (data || []).map(projectFromDb);
  } catch (err) {
    console.error("Failed to fetch featured projects from Supabase:", err);
    return [];
  }
}

/**
 * Fetch a single project by id
 */
export async function getProjectById(
  id: string,
): Promise<ProjectRecord | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      return null;
    }

    return data ? projectFromDb(data) : null;
  } catch (err) {
    console.error("Failed to fetch project from Supabase:", err);
    return null;
  }
}
