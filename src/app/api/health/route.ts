import { NextResponse } from "next/server";

export async function GET() {
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  return NextResponse.json({
    status: maintenanceMode ? "maintenance" : "operational",
    timestamp: new Date().toISOString(),
    maintenance: maintenanceMode,
  });
}
