import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Toggle maintenance mode - automatically enabled on maintenance-mode branch
const MAINTENANCE_MODE =
  process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" ||
  process.env.VERCEL_GIT_COMMIT_REF === "maintenance-mode";

// Paths that should be accessible during maintenance
const ALLOWED_PATHS = [
  "/maintenance",
  "/api/health", // Health check endpoint
  "/_next", // Next.js assets
  "/favicon.ico",
  "/assets",
];

// IP addresses that can bypass maintenance mode (optional)
const ALLOWED_IPS: string[] =
  process.env.MAINTENANCE_ALLOWED_IPS?.split(",") || [];

export function middleware(request: NextRequest) {
  // Skip if maintenance mode is disabled
  if (!MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow access to specific paths
  if (ALLOWED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if IP is allowed (optional bypass)
  const clientIp =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "";
  if (ALLOWED_IPS.includes(clientIp)) {
    return NextResponse.next();
  }

  // Check for bypass token in query params or cookie (optional)
  const bypassToken =
    request.nextUrl.searchParams.get("bypass") ||
    request.cookies.get("maintenance_bypass")?.value;
  if (bypassToken && bypassToken === process.env.MAINTENANCE_BYPASS_TOKEN) {
    // Set cookie for future requests
    const response = NextResponse.next();
    response.cookies.set("maintenance_bypass", bypassToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return response;
  }

  // Redirect to maintenance page
  if (pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
