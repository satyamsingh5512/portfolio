import { getObjectIdOrNull, toUpdate, validationError } from "@/lib/admin-api";
import { authOptions } from "@/lib/auth";
import {
  experienceFromDoc,
  getAllExperienceRecords,
  markCollectionManaged,
} from "@/lib/content";
import ExperienceModel from "@/lib/models/Experience";
import { connectToDatabase } from "@/lib/mongodb";
import { revalidatePublicSite } from "@/lib/revalidate";
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
  description: z.array(z.string().trim().min(1).max(1000)).max(50).default([]),
  technologies: z.array(z.string().trim().min(1).max(60)).max(50).default([]),
  location: z.string().trim().min(1).max(200),
  companyUrl: z.string().trim().url().optional().or(z.literal("")),
  logo: relativeOrAbsoluteUrlSchema.optional().default(""),
});

function toDb(body: z.infer<typeof experienceSchema>) {
  return {
    company: body.company,
    position: body.position,
    start_date: body.startDate,
    end_date: body.isCurrent ? "Present" : body.endDate || null,
    is_current: body.isCurrent ?? false,
    description: body.description,
    technologies: body.technologies,
    location: body.location,
    company_url: body.companyUrl || undefined,
    logo: body.logo || undefined,
  };
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session && session.user.role === "admin" ? session : null;
}

export async function GET() {
  try {
    return NextResponse.json(await getAllExperienceRecords());
  } catch (err) {
    console.error("Failed to fetch experiences:", err);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = experienceSchema.safeParse(await request.json());
    if (!parsed.success) return validationError("experience", parsed.error);

    await connectToDatabase();
    const created = await ExperienceModel.create(toDb(parsed.data));
    await markCollectionManaged("experiences");
    revalidatePublicSite();

    return NextResponse.json(
      experienceFromDoc(
        created.toObject() as unknown as Record<string, unknown>,
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
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const objectId = getObjectIdOrNull(
      new URL(request.url).searchParams.get("id"),
    );
    if (!objectId) {
      return NextResponse.json(
        { error: "Valid experience ID required" },
        { status: 400 },
      );
    }

    const parsed = experienceSchema.safeParse(await request.json());
    if (!parsed.success) return validationError("experience", parsed.error);

    await connectToDatabase();
    const { end_date, ...rest } = toDb(parsed.data);
    const update = toUpdate(rest);
    // end_date is nullable in the schema, so store null rather than unsetting.
    update.$set.end_date = end_date;

    const updated = await ExperienceModel.findByIdAndUpdate(objectId, update, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 },
      );
    }
    await markCollectionManaged("experiences");
    revalidatePublicSite();

    return NextResponse.json(
      experienceFromDoc(updated as unknown as Record<string, unknown>),
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
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const objectId = getObjectIdOrNull(
      new URL(request.url).searchParams.get("id"),
    );
    if (!objectId) {
      return NextResponse.json(
        { error: "Valid experience ID required" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const deleted = await ExperienceModel.findByIdAndDelete(objectId);
    if (!deleted) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 },
      );
    }
    await markCollectionManaged("experiences");
    revalidatePublicSite();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete experience:", err);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 },
    );
  }
}
