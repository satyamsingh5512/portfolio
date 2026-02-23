import { authOptions } from "@/lib/auth";
import ExperienceModel from "@/lib/models/Experience";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
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
    const body = await request.json();
    const created = await ExperienceModel.create({
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
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Experience ID required" },
        { status: 400 },
      );

    const body = await request.json();
    const updated = await ExperienceModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        $set: {
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
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Experience ID required" },
        { status: 400 },
      );

    await ExperienceModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete experience:", err);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 },
    );
  }
}
