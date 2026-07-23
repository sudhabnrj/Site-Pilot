import { NextResponse, type NextRequest } from "next/server";

// Public authentication pages
const AUTH_PAGES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

// Public API endpoints that don't require authentication
const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/refresh",
  "/api/auth/verify-email",
  "/api/auth/resend-verification",
  "/api/auth/seed-demo",
  "/api/auth/seed-admin",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and Next.js internal requests
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const nextAuthToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken || nextAuthToken);

  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));
  const isApiRoute = pathname.startsWith("/api/");
  const isPublicApiRoute =
    pathname.startsWith("/api/auth/") ||
    PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route));

  // 1. API Route Protection
  if (isApiRoute) {
    if (!isPublicApiRoute && !isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 2. Unauthenticated user accessing protected page -> Redirect to /login
  if (!isAuthenticated && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/" && pathname !== "/dashboard") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 3. Authenticated user accessing auth pages -> Redirect to Dashboard (/dashboard or /)
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
