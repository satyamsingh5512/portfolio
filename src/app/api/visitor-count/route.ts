import { NextResponse } from "next/server";

export async function GET() {
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID;
  const umamiApiKey = process.env.UMAMI_API_KEY;

  if (!umamiId || !umamiApiKey) {
    return NextResponse.json(
      { error: "Umami not configured" },
      { status: 500 },
    );
  }

  try {
    // Get stats for the last 365 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const response = await fetch(
      `https://api.umami.is/v1/websites/${umamiId}/stats?startAt=${startDate.getTime()}&endAt=${endDate.getTime()}`,
      {
        headers: {
          Authorization: `Bearer ${umamiApiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`);
    }

    const data = await response.json();

    // Prefer unique visitors so refreshes do not inflate the displayed count
    let visitorCount = data.visitors?.value;
    if (typeof visitorCount !== "number") {
      visitorCount = data.visitors;
    }
    if (typeof visitorCount !== "number") {
      visitorCount = data.uniques?.value;
    }
    if (typeof visitorCount !== "number") {
      visitorCount = data.uniques;
    }
    if (typeof visitorCount !== "number") {
      visitorCount = data.total;
    }

    if (typeof visitorCount !== "number") {
      return NextResponse.json(
        { error: "Invalid response structure from Umami" },
        { status: 500 },
      );
    }

    return NextResponse.json({ visitors: { value: visitorCount } });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor count" },
      { status: 500 },
    );
  }
}
