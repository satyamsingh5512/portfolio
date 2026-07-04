import SiteVisitorModel from "@/lib/models/SiteVisitor";
import { connectToDatabase } from "@/lib/mongodb";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;

  return "unknown";
}

function hashIP(ip: string): string {
  const salt = process.env.BLOG_VIEW_SALT || process.env.NEXTAUTH_SECRET || "";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

// GET -> unique visitor count (one per IP) + a list of recent visitors.
export async function GET() {
  try {
    await connectToDatabase();

    const visitorCount = await SiteVisitorModel.countDocuments({});

    const recent = await SiteVisitorModel.find({})
      .sort({ updatedAt: -1 })
      .limit(10)
      .select("path referrer country updatedAt visits -_id")
      .lean();

    return NextResponse.json({
      visitors: { value: visitorCount },
      recent,
    });
  } catch (error) {
    console.error("GET /api/visitor-count error:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor count" },
      { status: 500 },
    );
  }
}

// POST -> record a visit for the current IP. Unique visitors are deduped by
// IP hash; repeat visits only bump the visit counter and refresh metadata.
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const ipHash = hashIP(getClientIP(request));

    let path: string | undefined;
    let referrer: string | undefined;
    try {
      const body = (await request.json()) as {
        path?: string;
        referrer?: string;
      };
      path = typeof body.path === "string" ? body.path : undefined;
      referrer = typeof body.referrer === "string" ? body.referrer : undefined;
    } catch {
      // No / invalid body — record the visit without page metadata.
    }

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
    const visitorCount = await SiteVisitorModel.countDocuments({});

    return NextResponse.json({
      visitors: { value: visitorCount },
      counted: isNewVisitor,
    });
  } catch (error) {
    console.error("POST /api/visitor-count error:", error);
    return NextResponse.json(
      { error: "Failed to record visitor" },
      { status: 500 },
    );
  }
}
