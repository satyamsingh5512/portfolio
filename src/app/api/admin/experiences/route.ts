import { authOptions } from "@/lib/auth";
import ExperienceModel from "@/lib/models/Experience";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const relativeOrAbsoluteUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value.length === 0 || value.startsWith("/") || /^https?:\/\//.test(value),
    "Must be a relative path or an absolute URL",
  );

const experienceSchema = z.object({
  company: z.string().trim().min(1).max(200),
  position: z.string().trim().min(1).max(200),
  startDate: z.string().trim().min(1).max(50),
  endDate: z.string().trim().max(50).optional().or(z.literal("")),
  isCurrent: z.boolean().optional().default(false),
  description: z.array(z.string().trim().min(1).max(400)).max(50).default([]),
  technologies: z.array(z.string().trim().min(1).max(60)).max(50).default([]),
  location: z.string().trim().min(1).max(200),
  companyUrl: z.string().url().optional().or(z.literal("")),
  logo: relativeOrAbsoluteUrlSchema.optional().default(""),
});

function getObjectIdOrNull(id: string | null): mongoose.Types.ObjectId | null {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

interface ExperienceData {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string[];
  technologies: string[];
  location: string;
  companyUrl?: string;
  logo?: string;
  createdAt: string;
}

function docToData(doc: Record<string, unknown>): ExperienceData {
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
    createdAt: doc.createdAt
      ? new Date(doc.createdAt as string).toISOString()
      : new Date().toISOString(),
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    const data = await ExperienceModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      (data as unknown as Record<string, unknown>[]).map(docToData),
    );
  } catch (err) {
    console.error("Failed to fetch experiences:", err);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
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
    const parsed = experienceSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid experience payload",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }
    const body = parsed.data;
    const created = await ExperienceModel.create({
      company: body.company,
      position: body.position,
      start_date: body.startDate,
      end_date: body.endDate || null,
      is_current: body.isCurrent ?? false,
      description: body.description || [],
      technologies: body.technologies || [],
      location: body.location,
      company_url: body.companyUrl || undefined,
      logo: body.logo || undefined,
    });
    return NextResponse.json(
      docToData(
        created.toObject() as unknown as unknown as Record<string, unknown>,
      ),
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to create experience:", err);
    return NextResponse.json(
      { error: "Failed to create experience" },
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
    if (!objectId)
      return NextResponse.json(
        { error: "Valid experience ID required" },
        { status: 400 },
      );

    const parsed = experienceSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid experience payload",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }
    const body = parsed.data;
    const updated = await ExperienceModel.findByIdAndUpdate(
      objectId,
      {
        $set: {
          company: body.company,
          position: body.position,
          start_date: body.startDate,
          end_date: body.endDate || null,
          is_current: body.isCurrent ?? false,
          description: body.description || [],
          technologies: body.technologies || [],
          location: body.location,
          company_url: body.companyUrl || undefined,
          logo: body.logo || undefined,
        },
      },
      { new: true },
    ).lean();

    if (!updated)
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 },
      );
    return NextResponse.json(
      docToData(updated as unknown as Record<string, unknown>),
    );
  } catch (err) {
    console.error("Failed to update experience:", err);
    return NextResponse.json(
      { error: "Failed to update experience" },
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
    if (!objectId)
      return NextResponse.json(
        { error: "Valid experience ID required" },
        { status: 400 },
      );

    await ExperienceModel.findByIdAndDelete(objectId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete experience:", err);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 },
    );
  }
}
