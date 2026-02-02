import { authOptions } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface AchievementData {
  id: string;
  title: string;
  issuer: string;
  date: string;
  file: string;
  createdAt: string;
}

interface AchievementDB {
  id: string;
  title: string;
  issuer: string;
  date: string;
  file: string;
  created_at: string;
}

function fromDb(record: AchievementDB): AchievementData {
  return {
    id: record.id,
    title: record.title,
    issuer: record.issuer,
    date: record.date,
    file: record.file,
    createdAt: record.created_at,
  };
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json((data || []).map(fromDb));
  } catch (err) {
    console.error("Failed to fetch achievements:", err);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
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
    const supabase = getSupabase();
    const body = await request.json();

    const { data, error } = await supabase
      .from("achievements")
      .insert({
        title: body.title,
        issuer: body.issuer,
        date: body.date,
        file: body.file,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(fromDb(data), { status: 201 });
  } catch (err) {
    console.error("Failed to create achievement:", err);
    return NextResponse.json(
      { error: "Failed to create achievement" },
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Achievement ID required" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from("achievements")
      .update({
        title: body.title,
        issuer: body.issuer,
        date: body.date,
        file: body.file,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(fromDb(data));
  } catch (err) {
    console.error("Failed to update achievement:", err);
    return NextResponse.json(
      { error: "Failed to update achievement" },
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
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Achievement ID required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("achievements").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete achievement:", err);
    return NextResponse.json(
      { error: "Failed to delete achievement" },
      { status: 500 },
    );
  }
}
