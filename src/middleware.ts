import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Check if maintenance mode is enabled
  // Enabled if NEXT_PUBLIC_MAINTENANCE_MODE is "true" OR on the maintenance-mode branch
  const isMaintenanceMode =
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" ||
    process.env.VERCEL_GIT_COMMIT_REF === "maintenance-mode";

  // If not in maintenance mode, proceed as normal
  if (!isMaintenanceMode) {
    return NextResponse.next();
  }

  // 2. Paths that are ALWAYS allowed during maintenance
  const ALLOWED_PATHS = [
    "/maintenance",
    "/api/health",
    "/_next",
    "/favicon.ico",
    "/assets",
    "/api/og",
  ];

  if (ALLOWED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 3. Check for Bypass Token in URL (e.g., /?bypass=your-secret-token)
  const bypassToken = process.env.MAINTENANCE_BYPASS_TOKEN;
  const queryToken = searchParams.get("bypass");

  if (bypassToken && queryToken === bypassToken) {
    const response = NextResponse.redirect(new URL("/", request.url));
    // Set a cookie to bypass maintenance for 24 hours
    response.cookies.set("maintenance_bypass", bypassToken, {
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    return response;
  }

  // 4. Check for Bypass Cookie
  const bypassCookie = request.cookies.get("maintenance_bypass")?.value;
  if (bypassToken && bypassCookie === bypassToken) {
    return NextResponse.next();
  }

  // 5. Check for IP Whitelisting
  const allowedIps =
    process.env.MAINTENANCE_ALLOWED_IPS?.split(",").map((ip) => ip.trim()) ||
    [];
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    null;

  if (clientIp && allowedIps.includes(clientIp)) {
    return NextResponse.next();
  }

  // 6. Redirect to maintenance page
  // We use a redirect to ensure the URL bar shows /maintenance
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
