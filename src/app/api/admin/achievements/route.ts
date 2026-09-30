import { getObjectIdOrNull, validationError } from "@/lib/admin-api";
import { authOptions } from "@/lib/auth";
import {
  achievementFromDoc,
  getAllAchievementRecords,
  markCollectionManaged,
} from "@/lib/content";
import AchievementModel from "@/lib/models/Achievement";
import { connectToDatabase } from "@/lib/mongodb";
import { revalidatePublicSite } from "@/lib/revalidate";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const achievementSchema = z.object({
  title: z.string().trim().min(1).max(200),
  issuer: z.string().trim().min(1).max(300),
  date: z.string().trim().min(1).max(50),
  file: z
    .string()
    .trim()
    .min(1, "Certificate image is required")
    .refine(
      (value) => value.startsWith("/") || /^https?:\/\//.test(value),
      "File must be a relative path or an absolute URL",
    ),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session && session.user.role === "admin" ? session : null;
}

export async function GET() {
  try {
    return NextResponse.json(await getAllAchievementRecords());
  } catch (err) {
    console.error("Failed to fetch achievements:", err);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = achievementSchema.safeParse(await request.json());
    if (!parsed.success) return validationError("achievement", parsed.error);

    await connectToDatabase();
    const created = await AchievementModel.create(parsed.data);
    await markCollectionManaged("achievements");
    revalidatePublicSite();

    return NextResponse.json(
      achievementFromDoc(
        created.toObject() as unknown as Record<string, unknown>,
      ),
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to create achievement:", err);
    return NextResponse.json(
      { error: "Failed to create achievement" },
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
        { error: "Valid achievement ID required" },
        { status: 400 },
      );
    }

    const parsed = achievementSchema.safeParse(await request.json());
    if (!parsed.success) return validationError("achievement", parsed.error);

    await connectToDatabase();
    const updated = await AchievementModel.findByIdAndUpdate(
      objectId,
      { $set: parsed.data },
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 },
      );
    }
    await markCollectionManaged("achievements");
    revalidatePublicSite();

    return NextResponse.json(
      achievementFromDoc(updated as unknown as Record<string, unknown>),
    );
  } catch (err) {
    console.error("Failed to update achievement:", err);
    return NextResponse.json(
      { error: "Failed to update achievement" },
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
        { error: "Valid achievement ID required" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const deleted = await AchievementModel.findByIdAndDelete(objectId);
    if (!deleted) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 },
      );
    }
    await markCollectionManaged("achievements");
    revalidatePublicSite();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete achievement:", err);
    return NextResponse.json(
      { error: "Failed to delete achievement" },
      { status: 500 },
    );
  }
}
