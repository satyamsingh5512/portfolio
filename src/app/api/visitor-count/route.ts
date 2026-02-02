import { NextResponse } from "next/server";

export async function GET() {
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID;
  const umamiApiKey = process.env.UMAMI_API_KEY;

  console.log("Umami ID:", umamiId);
  console.log("Umami API Key exists:", !!umamiApiKey);

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

    console.log(
      "Fetching from:",
      `https://api.umami.is/v1/websites/${umamiId}/stats?startAt=${startDate.getTime()}&endAt=${endDate.getTime()}`,
    );

    const response = await fetch(
      `https://api.umami.is/v1/websites/${umamiId}/stats?startAt=${startDate.getTime()}&endAt=${endDate.getTime()}`,
      {
        headers: {
          Authorization: `Bearer ${umamiApiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`Umami API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Umami API response:", data);

    // Try different possible structures
    let visitorCount = data.pageviews?.value;
    if (typeof visitorCount !== "number") {
      visitorCount = data.pageviews;
    }
    if (typeof visitorCount !== "number") {
      visitorCount = data.total;
    }
    if (typeof visitorCount !== "number") {
      visitorCount = data.visitors?.value;
    }

    if (typeof visitorCount !== "number") {
      console.log("Could not find visitor count in response");
      return NextResponse.json(
        { error: "Invalid response structure from Umami" },
        { status: 500 },
      );
    }

    return NextResponse.json({ pageviews: { value: visitorCount } });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor count" },
      { status: 500 },
    );
  }
}
