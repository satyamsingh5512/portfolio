import ShortLinkModel from "@/lib/models/ShortLink";
import { connectToDatabase } from "@/lib/mongodb";
import { CODE_PATTERN } from "@/lib/short-links";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ code: string }>;
}

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

/**
 * POST /api/short-link/[code]/click — records an outbound click and returns the
 * destination. Public: it only ever exposes a link the owner already published.
 */
export async function POST(_req: NextRequest, { params }: RouteParams) {
  try {
    const { code } = await params;
    if (!CODE_PATTERN.test(code)) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers: NO_STORE_HEADERS },
      );
    }

    await connectToDatabase();
    const link = await ShortLinkModel.findOneAndUpdate(
      { code, isActive: true, kind: { $ne: "blog" } },
      { $inc: { clicks: 1 }, $set: { lastClickedAt: new Date() } },
      { returnDocument: "after" },
    ).lean();

    if (!link) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers: NO_STORE_HEADERS },
      );
    }

    return NextResponse.json(
      { url: (link as unknown as { url: string }).url },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("POST /api/short-link/[code]/click error:", error);
    return NextResponse.json(
      { error: "Failed to record click" },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
