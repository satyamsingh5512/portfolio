import { authOptions } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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

interface ExperienceDB {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string[];
  technologies: string[];
  location: string;
  company_url?: string;
  logo?: string;
  created_at: string;
}

function fromDb(record: ExperienceDB): ExperienceData {
  return {
    id: record.id,
    company: record.company,
    position: record.position,
    startDate: record.start_date,
    endDate: record.end_date,
    isCurrent: record.is_current,
    description: record.description,
    technologies: record.technologies,
    location: record.location,
    companyUrl: record.company_url,
    logo: record.logo,
    createdAt: record.created_at,
  };
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json((data || []).map(fromDb));
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
    const supabase = getSupabase();
    const body = await request.json();

    const { data, error } = await supabase
      .from("experiences")
      .insert({
        company: body.company,
        position: body.position,
        start_date: body.startDate,
        end_date: body.endDate,
        is_current: body.isCurrent ?? false,
        description: body.description || [],
        technologies: body.technologies || [],
        location: body.location,
        company_url: body.companyUrl,
        logo: body.logo,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(fromDb(data), { status: 201 });
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
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Experience ID required" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from("experiences")
      .update({
        company: body.company,
        position: body.position,
        start_date: body.startDate,
        end_date: body.endDate,
        is_current: body.isCurrent ?? false,
        description: body.description || [],
        technologies: body.technologies || [],
        location: body.location,
        company_url: body.companyUrl,
        logo: body.logo,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(fromDb(data));
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
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Experience ID required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("experiences").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete experience:", err);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 },
    );
  }
}
