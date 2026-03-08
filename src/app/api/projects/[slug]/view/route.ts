import PortfolioViewModel from "@/lib/models/PortfolioView";
import { connectToDatabase } from "@/lib/mongodb";
import { getProjectCaseStudyBySlug } from "@/lib/project";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

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

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    const views = await PortfolioViewModel.countDocuments({
      contentType: "project",
      slug,
    });

    return NextResponse.json({ views });
  } catch (error) {
    console.error("GET /api/projects/[slug]/view error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project views" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Validate that the project actually exists
    const project = getProjectCaseStudyBySlug(slug);
    if (!project || !project.frontmatter.isPublished) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await connectToDatabase();

    // Prefer the client-supplied visitorId (session UUID) for deduplication.
    // Fall back to IP hash when visitorId is absent (e.g. direct API calls).
    let ipHash: string;
    try {
      const body = (await request.json()) as { visitorId?: string };
      if (body.visitorId && typeof body.visitorId === "string") {
        ipHash = hashIP(body.visitorId);
      } else {
        ipHash = hashIP(getClientIP(request));
      }
    } catch {
      ipHash = hashIP(getClientIP(request));
    }

    // Project views count ONLY towards the portfolio total, not the blog count.
    const result = await PortfolioViewModel.updateOne(
      { contentType: "project", slug, ipHash },
      { $setOnInsert: { contentType: "project", slug, ipHash } },
      { upsert: true },
    );

    const isNewUniqueView = result.upsertedCount > 0;
    const views = await PortfolioViewModel.countDocuments({
      contentType: "project",
      slug,
    });

    return NextResponse.json({ views, counted: isNewUniqueView });
  } catch (error) {
    console.error("POST /api/projects/[slug]/view error:", error);
    return NextResponse.json(
      { error: "Failed to update project views" },
      { status: 500 },
    );
  }
}
