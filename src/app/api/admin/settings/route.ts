import { authOptions } from "@/lib/auth";
import SiteSettingModel from "@/lib/models/SiteSetting";
import { connectToDatabase } from "@/lib/mongodb";
import { getSiteSettings } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const validKeys = [
  "hero",
  "about",
  "socialLinks",
  "contact",
  "cta",
  "footer",
] as const;

const settingsSchema = z.object({
  key: z.enum(validKeys),
  value: z.unknown(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("Failed to fetch site settings:", err);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
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
    const parsed = settingsSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid settings payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { key, value } = parsed.data;

    await connectToDatabase();
    await SiteSettingModel.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true },
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update site settings:", err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
