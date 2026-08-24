import { githubConfig } from "@/config/Github";
import { NextResponse } from "next/server";

// Cache for 6 hours: the calendar changes at most a few times a day and this
// keeps the third-party origin off the critical path of every visit.
export const revalidate = 21600;

type UpstreamDay = { date: string; count: number; level: number };

type UpstreamResponse = {
  total?: Record<string, number>;
  contributions?: UpstreamDay[];
};

export type ContributionsPayload = {
  contributions: { date: string; count: number; level: number }[];
  total: number;
};

const EMPTY: ContributionsPayload = { contributions: [], total: 0 };

/**
 * Server-side proxy for the GitHub contributions API.
 *
 * The browser used to call the third-party API directly, which failed CORS and
 * logged console errors. Proxying also lets us normalise the payload and always
 * answer with 200 so a flaky upstream never shows up as a client-side error.
 */
export async function GET() {
  try {
    const upstream = await fetch(
      `${githubConfig.apiUrl}/${githubConfig.username}?y=last`,
      { next: { revalidate }, headers: { accept: "application/json" } },
    );

    if (!upstream.ok) {
      return NextResponse.json(EMPTY, { status: 200 });
    }

    const data = (await upstream.json()) as UpstreamResponse;
    const days = Array.isArray(data.contributions) ? data.contributions : [];

    const today = new Date().toISOString().slice(0, 10);
    const contributions = days
      .filter((day) => typeof day?.date === "string" && day.date <= today)
      .map((day) => ({
        date: day.date,
        count: Number(day.count) || 0,
        level: Number(day.level) || 0,
      }));

    const total = contributions.reduce((sum, day) => sum + day.count, 0);

    return NextResponse.json(
      { contributions, total },
      {
        headers: {
          "Cache-Control":
            "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(EMPTY, { status: 200 });
  }
}
