import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import ProjectModel from "@/lib/models/Project";
import { projectToDb } from "@/lib/supabase";
import type { ProjectRecord } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

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
    createdAt: doc.createdAt ? new Date(doc.createdAt as string).toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt as string).toISOString() : new Date().toISOString(),
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    const data = await ProjectModel.find({}).sort({ createdAt: -1 }).lean();
    const projects = (data as unknown as Record<string, unknown>[]).map(docToRecord);
    return NextResponse.json(projects);
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await request.json();
    const dbData = projectToDb(body);

    const created = await ProjectModel.create(dbData);
    return NextResponse.json(docToRecord(created.toObject() as unknown as unknown as Record<string, unknown>), { status: 201 });
  } catch (err) {
    console.error("Failed to create project:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
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
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    const body = await request.json();
    const dbData = projectToDb(body);

    const updated = await ProjectModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: dbData },
      { returnDocument: "after" },
    ).lean();

    if (!updated) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json(docToRecord(updated as unknown as Record<string, unknown>));
  } catch (err) {
    console.error("Failed to update project:", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    await ProjectModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete project:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
