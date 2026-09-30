import { getObjectIdOrNull, validationError } from "@/lib/admin-api";
import { authOptions } from "@/lib/auth";
import {
  getAllProjectRecords,
  markCollectionManaged,
  projectFromDoc,
} from "@/lib/content";
import ProjectModel from "@/lib/models/Project";
import { connectToDatabase } from "@/lib/mongodb";
import { revalidatePublicSite } from "@/lib/revalidate";
import { projectToDb } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

/*
 * Project detail pages (/projects/<slug>) render from MongoDB when there is no
 * hand-written src/data/projects/<slug>.mdx, and overlay the DB fields on top
 * of it when there is — so nothing needs to be written to the filesystem here
 * (which would fail on a read-only serverless deployment anyway).
 */

const relativeOrAbsoluteUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value.length === 0 || value.startsWith("/") || /^https?:\/\//.test(value),
    "Must be a relative path or an absolute URL",
  );

const projectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  shortDescription: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).max(20000),
  technologies: z.array(z.string().trim().min(1).max(60)).max(50),
  githubUrl: z.string().trim().url().optional().or(z.literal("")),
  liveUrl: z.string().trim().url().optional().or(z.literal("")),
  image: relativeOrAbsoluteUrlSchema.optional().default(""),
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in-progress", "archived"]).default("completed"),
  startDate: z.string().trim().max(50).optional().or(z.literal("")),
  endDate: z.string().trim().max(50).optional().or(z.literal("")),
  category: z.string().trim().max(120).optional().or(z.literal("")),
  orderIndex: z.number().int().min(0).max(100000).default(0),
});

/** Maps the form payload to DB fields; cleared optionals become `null`. */
function toDb(body: z.infer<typeof projectSchema>) {
  return projectToDb({
    ...body,
    githubUrl: body.githubUrl || undefined,
    liveUrl: body.liveUrl || undefined,
    image: body.image || undefined,
    startDate: body.startDate || undefined,
    endDate: body.endDate || undefined,
    category: body.category || undefined,
  });
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session && session.user.role === "admin" ? session : null;
}

export async function GET() {
  try {
    return NextResponse.json(await getAllProjectRecords());
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = projectSchema.safeParse(await request.json());
    if (!parsed.success) return validationError("project", parsed.error);

    await connectToDatabase();
    const created = await ProjectModel.create(toDb(parsed.data));
    await markCollectionManaged("projects");
    revalidatePublicSite();

    return NextResponse.json(
      projectFromDoc(created.toObject() as unknown as Record<string, unknown>),
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
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const objectId = getObjectIdOrNull(
      new URL(request.url).searchParams.get("id"),
    );
    if (!objectId) {
      return NextResponse.json(
        { error: "Valid project ID required" },
        { status: 400 },
      );
    }

    const parsed = projectSchema.safeParse(await request.json());
    if (!parsed.success) return validationError("project", parsed.error);

    await connectToDatabase();
    // Nullable fields are set to null (not left untouched) when cleared.
    const updated = await ProjectModel.findByIdAndUpdate(
      objectId,
      { $set: toDb(parsed.data) },
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    await markCollectionManaged("projects");
    revalidatePublicSite();

    return NextResponse.json(
      projectFromDoc(updated as unknown as Record<string, unknown>),
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
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const objectId = getObjectIdOrNull(
      new URL(request.url).searchParams.get("id"),
    );
    if (!objectId) {
      return NextResponse.json(
        { error: "Valid project ID required" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const deleted = await ProjectModel.findByIdAndDelete(objectId);
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    await markCollectionManaged("projects");
    revalidatePublicSite();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete project:", err);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
