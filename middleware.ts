import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authUser = request.cookies.get("auth_user")?.value;
  const authRole = request.cookies.get("auth_role")?.value;

  const isLoggedIn = !!authUser && !!authRole;

  const publicPaths = ["/", "/login", "/register"];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/client-dashboard")) {
    if (!isLoggedIn || authRole !== "client") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/company-dashboard")) {
    if (!isLoggedIn || authRole !== "company") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/company-home")) {
    if (!isLoggedIn || authRole !== "company") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/designer-dashboard")) {
    if (!isLoggedIn || authRole !== "designer") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/client-dashboard/:path*",
    "/company-dashboard/:path*",
    "/company-home/:path*",
    "/designer-dashboard/:path*",
    "/login",
    "/register",
    "/",
  ],
};