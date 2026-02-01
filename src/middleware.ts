import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Toggle maintenance mode - automatically enabled on maintenance-mode branch
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

// Paths that should be accessible during maintenance
const ALLOWED_PATHS = [
  "/maintenance",
  "/api/health", // Health check endpoint
  "/_next", // Next.js assets
  "/favicon.ico",
  "/assets",
];

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
