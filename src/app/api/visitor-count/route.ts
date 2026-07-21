import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const UMAMI_STATS_API = "https://api.umami.is/v1";
const UPSTREAM_TIMEOUT_MS = 10_000;
const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

type UmamiStats = {
  visitors?: number | { value?: number };
  uniques?: number | { value?: number };
  total?: number;
};

function getVisitorCount(stats: UmamiStats): number | null {
  const candidates = [stats.visitors, stats.uniques, stats.total];

  for (const candidate of candidates) {
    const value =
      typeof candidate === "number"
        ? candidate
        : typeof candidate?.value === "number"
          ? candidate.value
          : null;

    if (value !== null && Number.isFinite(value) && value >= 0) {
      return value;
    }
  }

  return null;
}

export async function GET() {
  // NEXT_PUBLIC_* values are substituted during `next build`, which made the
  // previous handler permanently return 500 if the public ID was unavailable
  // at build time. Keep the website ID in a server runtime variable instead.
  const umamiId =
    process.env.UMAMI_WEBSITE_ID?.trim() ||
    process.env.NEXT_PUBLIC_UMAMI_ID?.trim();
  const umamiApiKey = process.env.UMAMI_API_KEY?.trim();

  if (!umamiId || !umamiApiKey) {
    console.error(
      "Visitor count is not configured: set UMAMI_WEBSITE_ID and UMAMI_API_KEY.",
    );
    return NextResponse.json(
      { error: "Visitor analytics is not configured" },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  try {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - 1);

    const response = await fetch(
      `${UMAMI_STATS_API}/websites/${encodeURIComponent(umamiId)}/stats?startAt=${startDate.getTime()}&endAt=${endDate.getTime()}`,
      {
        cache: "no-store",
        headers: {
          "x-umami-api-key": umamiApiKey,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      console.error(`Umami visitor-count request failed: ${response.status}`);
      return NextResponse.json(
        { error: "Visitor analytics service is unavailable" },
        { status: 502, headers: NO_STORE_HEADERS },
      );
    }

    const visitorCount = getVisitorCount((await response.json()) as UmamiStats);
    if (visitorCount === null) {
      console.error(
        "Umami visitor-count response did not contain a valid count.",
      );
      return NextResponse.json(
        { error: "Visitor analytics returned an invalid response" },
        { status: 502, headers: NO_STORE_HEADERS },
      );
    }

    return NextResponse.json(
      { visitors: { value: visitorCount } },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("Error fetching Umami visitor count:", error);
    return NextResponse.json(
      { error: "Visitor analytics service is unavailable" },
      { status: 502, headers: NO_STORE_HEADERS },
    );
  }
}
