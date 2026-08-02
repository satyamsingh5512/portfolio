import { authOptions } from "@/lib/auth";
import ShortLinkModel from "@/lib/models/ShortLink";
import { connectToDatabase } from "@/lib/mongodb";
import {
  CODE_PATTERN,
  docToShortLinkData,
  generateUniqueCode,
  isReservedCode,
  validateDestination,
} from "@/lib/short-links";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const shortLinkSchema = z.object({
  url: z.string().trim().min(1).max(2048),
  // Empty string -> auto-generate.
  code: z
    .string()
    .trim()
    .max(5)
    .optional()
    .transform((value) => value || undefined),
  title: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => value || undefined),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((value) => value || undefined),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
  isActive: z.boolean().optional(),
  expiresAt: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
});

function getObjectIdOrNull(id: string | null): mongoose.Types.ObjectId | null {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function parseExpiry(value?: string): Date | null | { error: string } {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { error: "Invalid expiry date" };
  return date;
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectToDatabase();
    const data = await ShortLinkModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      (data as unknown as Record<string, unknown>[]).map(docToShortLinkData),
    );
  } catch (err) {
    console.error("Failed to fetch short links:", err);
    return NextResponse.json(
      { error: "Failed to fetch short links" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectToDatabase();
    const parsed = shortLinkSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const body = parsed.data;

    const destination = validateDestination(body.url);
    if (!destination.ok) {
      return NextResponse.json({ error: destination.error }, { status: 400 });
    }

    let code = body.code;
    if (code) {
      if (!CODE_PATTERN.test(code)) {
        return NextResponse.json(
          { error: "Code must be 4–5 letters or digits" },
          { status: 400 },
        );
      }
      if (isReservedCode(code)) {
        return NextResponse.json(
          { error: "That code is reserved" },
          { status: 400 },
        );
      }
      if (await ShortLinkModel.exists({ code })) {
        return NextResponse.json(
          { error: "That code is already taken" },
          { status: 409 },
        );
      }
    } else {
      code = await generateUniqueCode();
    }

    const expiresAt = parseExpiry(body.expiresAt);
    if (expiresAt && "error" in expiresAt) {
      return NextResponse.json({ error: expiresAt.error }, { status: 400 });
    }

    const created = await ShortLinkModel.create({
      code,
      url: destination.url,
      kind: "external",
      title: body.title,
      description: body.description,
      tags: body.tags ?? [],
      isActive: body.isActive ?? true,
      expiresAt,
    });

    return NextResponse.json(
      docToShortLinkData(
        created.toObject() as unknown as Record<string, unknown>,
      ),
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to create short link:", err);
    return NextResponse.json(
      { error: "Failed to create short link" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const objectId = getObjectIdOrNull(searchParams.get("id"));
    if (!objectId) {
      return NextResponse.json(
        { error: "Valid short link ID required" },
        { status: 400 },
      );
    }

    const parsed = shortLinkSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const body = parsed.data;

    const existing = await ShortLinkModel.findById(objectId);
    if (!existing) {
      return NextResponse.json(
        { error: "Short link not found" },
        { status: 404 },
      );
    }

    // A blog link's destination is owned by the post it points at — only its
    // code and presentation fields are editable here.
    let destinationUrl = existing.url;
    if (existing.kind !== "blog") {
      const destination = validateDestination(body.url);
      if (!destination.ok) {
        return NextResponse.json({ error: destination.error }, { status: 400 });
      }
      destinationUrl = destination.url!;
    }

    let code = existing.code;
    if (body.code && body.code !== existing.code) {
      if (!CODE_PATTERN.test(body.code)) {
        return NextResponse.json(
          { error: "Code must be 4–5 letters or digits" },
          { status: 400 },
        );
      }
      if (isReservedCode(body.code)) {
        return NextResponse.json(
          { error: "That code is reserved" },
          { status: 400 },
        );
      }
      if (await ShortLinkModel.exists({ code: body.code })) {
        return NextResponse.json(
          { error: "That code is already taken" },
          { status: 409 },
        );
      }
      code = body.code;
    }

    const expiresAt = parseExpiry(body.expiresAt);
    if (expiresAt && "error" in expiresAt) {
      return NextResponse.json({ error: expiresAt.error }, { status: 400 });
    }

    const updated = await ShortLinkModel.findByIdAndUpdate(
      objectId,
      {
        $set: {
          code,
          url: destinationUrl,
          title: body.title,
          description: body.description,
          tags: body.tags ?? [],
          isActive: body.isActive ?? true,
          expiresAt,
        },
      },
      { returnDocument: "after" },
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Short link not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      docToShortLinkData(updated as unknown as Record<string, unknown>),
    );
  } catch (err) {
    console.error("Failed to update short link:", err);
    return NextResponse.json(
      { error: "Failed to update short link" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const objectId = getObjectIdOrNull(searchParams.get("id"));
    if (!objectId) {
      return NextResponse.json(
        { error: "Valid short link ID required" },
        { status: 400 },
      );
    }

    await ShortLinkModel.findByIdAndDelete(objectId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete short link:", err);
    return NextResponse.json(
      { error: "Failed to delete short link" },
      { status: 500 },
    );
  }
}
