import { NextResponse } from "next/server";

export async function GET() {
  const isMaintenanceMode =
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" ||
    process.env.VERCEL_GIT_COMMIT_REF === "maintenance-mode";

  return NextResponse.json({
    status: isMaintenanceMode ? "maintenance" : "operational",
    timestamp: new Date().toISOString(),
    maintenance: isMaintenanceMode,
  });
}
