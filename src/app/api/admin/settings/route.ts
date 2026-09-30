import { authOptions } from "@/lib/auth";
import SiteSettingModel from "@/lib/models/SiteSetting";
import { connectToDatabase } from "@/lib/mongodb";
import { revalidatePublicSite } from "@/lib/revalidate";
import { SOCIAL_ICONS, getSiteSettings } from "@/lib/site-settings";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const text = (max: number) => z.string().trim().max(max);

/** Site-relative path, http(s) URL, or mailto:/tel: link. Empty allowed. */
const link = text(2000).refine(
  (value) =>
    value === "" ||
    (value.startsWith("/") && !value.startsWith("//")) ||
    /^(https?:\/\/|mailto:|tel:)/i.test(value),
  "Must be a /path, an http(s):// URL, or a mailto:/tel: link",
);

/** Per-section schemas: the public pages render these values directly. */
const valueSchemas = {
  hero: z.object({
    name: text(100).min(1),
    title: text(200),
    avatar: link,
    description: text(3000),
    resumeUrl: link,
    contactUrl: link,
    skills: z.array(z.object({ name: text(60).min(1), href: link })).max(30),
  }),
  about: z.object({
    name: text(100),
    description: text(5000),
    skills: z.array(text(60).min(1)).max(50),
    highlights: z
      .array(z.object({ title: text(120).min(1), description: text(600) }))
      .max(20)
      .default([]),
    expertise: z.array(text(300).min(1)).max(30).default([]),
  }),
  socialLinks: z
    .array(
      z.object({
        name: text(60).min(1),
        href: link.refine((v) => v !== "", "Link is required"),
        icon: z.enum(SOCIAL_ICONS),
      }),
    )
    .max(20),
  contact: z.object({
    title: text(120).min(1),
    description: text(1000),
    email: z.string().trim().email().max(200).or(z.literal("")),
  }),
  cta: z.object({
    profileImage: link,
    preText: text(300),
    linkText: text(80).min(1),
    calLink: text(300),
  }),
  footer: z.object({
    developer: text(100),
    text: text(200),
    copyright: text(200),
  }),
} as const;

type SettingKey = keyof typeof valueSchemas;

const settingsSchema = z.object({
  key: z.enum(Object.keys(valueSchemas) as [SettingKey, ...SettingKey[]]),
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
    const { key } = parsed.data;
    const value = valueSchemas[key].safeParse(parsed.data.value);
    if (!value.success) {
      const issue = value.error.issues[0];
      return NextResponse.json(
        {
          error: `Invalid ${key}: ${issue?.path.join(".") || "value"} — ${issue?.message ?? "invalid"}`,
          details: value.error.flatten(),
        },
        { status: 400 },
      );
    }

    await connectToDatabase();
    await SiteSettingModel.findOneAndUpdate(
      { key },
      { key, value: value.data },
      { upsert: true, returnDocument: "after" },
    );

    revalidatePublicSite();
    return NextResponse.json({ success: true, value: value.data });
  } catch (err) {
    console.error("Failed to update site settings:", err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
