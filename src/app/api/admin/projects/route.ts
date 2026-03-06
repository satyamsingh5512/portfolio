import { authOptions } from "@/lib/auth";
import ProjectModel from "@/lib/models/Project";
import { connectToDatabase } from "@/lib/mongodb";
import { projectToDb } from "@/lib/supabase";
import type { ProjectRecord } from "@/lib/supabase";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const projectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  shortDescription: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).max(5000),
  technologies: z.array(z.string().trim().min(1).max(60)).max(50),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in-progress", "archived"]).default("completed"),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  category: z.string().trim().max(120).optional().or(z.literal("")),
  orderIndex: z.number().int().min(0).max(100000).default(0),
});

function getObjectIdOrNull(id: string | null): mongoose.Types.ObjectId | null {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

function docToRecord(doc: Record<string, unknown>): ProjectRecord {
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
    createdAt: doc.createdAt
      ? new Date(doc.createdAt as string).toISOString()
      : new Date().toISOString(),
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt as string).toISOString()
      : new Date().toISOString(),
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    const data = await ProjectModel.find({}).sort({ order_index: 1 }).lean();
    const projects = (data as unknown as Record<string, unknown>[]).map(
      docToRecord,
    );
    return NextResponse.json(projects);
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const parsed = projectSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid project payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const body = parsed.data;
    const dbData = projectToDb({
      ...body,
      githubUrl: body.githubUrl || undefined,
      liveUrl: body.liveUrl || undefined,
      image: body.image || undefined,
      startDate: body.startDate || undefined,
      endDate: body.endDate || undefined,
      category: body.category || undefined,
    });

    const created = await ProjectModel.create(dbData);
    return NextResponse.json(
      docToRecord(
        created.toObject() as unknown as unknown as Record<string, unknown>,
      ),
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to create project:", err);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const objectId = getObjectIdOrNull(searchParams.get("id"));
    if (!objectId) {
      return NextResponse.json(
        { error: "Valid project ID required" },
        { status: 400 },
      );
    }

    const parsed = projectSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid project payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const body = parsed.data;
    const dbData = projectToDb({
      ...body,
      githubUrl: body.githubUrl || undefined,
      liveUrl: body.liveUrl || undefined,
      image: body.image || undefined,
      startDate: body.startDate || undefined,
      endDate: body.endDate || undefined,
      category: body.category || undefined,
    });

    const updated = await ProjectModel.findByIdAndUpdate(
      objectId,
      { $set: dbData },
      { new: true },
    ).lean();

    if (!updated)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json(
      docToRecord(updated as unknown as Record<string, unknown>),
    );
  } catch (err) {
    console.error("Failed to update project:", err);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const objectId = getObjectIdOrNull(searchParams.get("id"));
    if (!objectId) {
      return NextResponse.json(
        { error: "Valid project ID required" },
        { status: 400 },
      );
    }

    await ProjectModel.findByIdAndDelete(objectId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete project:", err);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
