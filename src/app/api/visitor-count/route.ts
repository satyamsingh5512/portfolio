import SiteVisitorModel from "@/lib/models/SiteVisitor";
import { connectToDatabase } from "@/lib/mongodb";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;

  return "unknown";
}

function hashIP(value: string): string {
  const salt =
    process.env.VISITOR_SALT ||
    process.env.BLOG_VIEW_SALT ||
    process.env.NEXTAUTH_SECRET ||
    "";
  return createHash("sha256").update(`${value}:${salt}`).digest("hex");
}

// GET -> total number of unique visitors.
export async function GET() {
  try {
    await connectToDatabase();
    const visitorCount = await SiteVisitorModel.estimatedDocumentCount();

    return NextResponse.json(
      { visitors: { value: visitorCount } },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("GET /api/visitor-count error:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor count" },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}

// POST -> record a visit for the current client. Unique visitors are deduped by
// a salted IP hash (or a client-supplied session id); repeat visits only bump
// the visit counter and refresh metadata.
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    let path: string | undefined;
    let referrer: string | undefined;
    let visitorId: string | undefined;
    try {
      const body = (await request.json()) as {
        path?: string;
        referrer?: string;
        visitorId?: string;
      };
      path = typeof body.path === "string" ? body.path : undefined;
      referrer = typeof body.referrer === "string" ? body.referrer : undefined;
      visitorId =
        typeof body.visitorId === "string" ? body.visitorId : undefined;
    } catch {
      // No / invalid body — record the visit without extra metadata.
    }

    // Prefer a stable client-supplied session id so the same browser session is
    // deduplicated even behind shared/changing IPs; fall back to the IP hash.
    const ipHash = hashIP(visitorId || getClientIP(request));
    const userAgent = request.headers.get("user-agent") ?? undefined;
    const country =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry") ??
      undefined;

    const result = await SiteVisitorModel.updateOne(
      { ipHash },
      {
        $inc: { visits: 1 },
        $set: { path, referrer, userAgent, country },
        $setOnInsert: { ipHash },
      },
      { upsert: true },
    );

    const isNewVisitor = result.upsertedCount > 0;
    const visitorCount = await SiteVisitorModel.estimatedDocumentCount();

    return NextResponse.json(
      { visitors: { value: visitorCount }, counted: isNewVisitor },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("POST /api/visitor-count error:", error);
    return NextResponse.json(
      { error: "Failed to record visitor" },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
