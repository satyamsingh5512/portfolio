import { authOptions } from "@/lib/auth";
import { SiteSettings, getSiteSettings, getSupabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
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
    const supabase = getSupabase();
    const { key, value } = await request.json();

    if (!key || !value) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 },
      );
    }

    const validKeys: (keyof SiteSettings)[] = [
      "hero",
      "about",
      "socialLinks",
      "contact",
      "cta",
      "footer",
    ];
    if (!validKeys.includes(key)) {
      return NextResponse.json(
        { error: "Invalid settings key" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: "key" },
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update site settings:", err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
