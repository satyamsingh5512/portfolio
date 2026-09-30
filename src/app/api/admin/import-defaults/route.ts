import { authOptions } from "@/lib/auth";
import { type ManagedCollection, importConfigDefaults } from "@/lib/content";
import { revalidatePublicSite } from "@/lib/revalidate";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const requestSchema = z.object({
  collection: z.enum(["experiences", "achievements", "projects"]),
});

/**
 * POST /api/admin/import-defaults — copies the built-in src/config entries the
 * public site is falling back to into MongoDB so they become editable.
 * No-op (imported: 0) if the collection already has documents.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(
    await request.json().catch(() => ({})),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "collection must be experiences, achievements or projects" },
      { status: 400 },
    );
  }

  try {
    const collection: ManagedCollection = parsed.data.collection;
    const imported = await importConfigDefaults(collection);
    revalidatePublicSite();
    return NextResponse.json({ imported });
  } catch (err) {
    console.error("Failed to import config defaults:", err);
    return NextResponse.json(
      { error: "Failed to import built-in entries" },
      { status: 500 },
    );
  }
}
