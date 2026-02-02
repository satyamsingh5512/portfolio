import { authOptions } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface QuoteData {
  id: string;
  quote: string;
  author: string;
  createdAt: string;
}

interface QuoteDB {
  id: string;
  quote: string;
  author: string;
  created_at: string;
}

function fromDb(record: QuoteDB): QuoteData {
  return {
    id: record.id,
    quote: record.quote,
    author: record.author,
    createdAt: record.created_at,
  };
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json((data || []).map(fromDb));
  } catch (err) {
    console.error("Failed to fetch quotes:", err);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
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
      .from("quotes")
      .insert({
        quote: body.quote,
        author: body.author,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(fromDb(data), { status: 201 });
  } catch (err) {
    console.error("Failed to create quote:", err);
    return NextResponse.json(
      { error: "Failed to create quote" },
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
      return NextResponse.json({ error: "Quote ID required" }, { status: 400 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from("quotes")
      .update({
        quote: body.quote,
        author: body.author,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(fromDb(data));
  } catch (err) {
    console.error("Failed to update quote:", err);
    return NextResponse.json(
      { error: "Failed to update quote" },
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
      return NextResponse.json({ error: "Quote ID required" }, { status: 400 });
    }

    const { error } = await supabase.from("quotes").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete quote:", err);
    return NextResponse.json(
      { error: "Failed to delete quote" },
      { status: 500 },
    );
  }
}
