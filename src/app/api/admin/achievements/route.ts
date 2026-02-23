import { authOptions } from "@/lib/auth";
import AchievementModel from "@/lib/models/Achievement";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
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

function docToData(doc: Record<string, unknown>): AchievementData {
  return {
    id: String(doc._id),
    title: String(doc.title ?? ""),
    issuer: String(doc.issuer ?? ""),
    date: String(doc.date ?? ""),
    file: String(doc.file ?? ""),
    createdAt: doc.createdAt
      ? new Date(doc.createdAt as string).toISOString()
      : new Date().toISOString(),
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    const data = await AchievementModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      (data as unknown as Record<string, unknown>[]).map(docToData),
    );
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
    await connectToDatabase();
    const body = await request.json();
    const created = await AchievementModel.create({
      title: body.title,
      issuer: body.issuer,
      date: body.date,
      file: body.file,
    });
    return NextResponse.json(
      docToData(
        created.toObject() as unknown as unknown as Record<string, unknown>,
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
        { error: "Achievement ID required" },
        { status: 400 },
      );

    const body = await request.json();
    const updated = await AchievementModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        $set: {
          title: body.title,
          issuer: body.issuer,
          date: body.date,
          file: body.file,
        },
      },
      { new: true },
    ).lean();

    if (!updated)
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 },
      );
    return NextResponse.json(
      docToData(updated as unknown as Record<string, unknown>),
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
        { error: "Achievement ID required" },
        { status: 400 },
      );

    await AchievementModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete achievement:", err);
    return NextResponse.json(
      { error: "Failed to delete achievement" },
      { status: 500 },
    );
  }
}
