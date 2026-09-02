import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const FAMILY_PREFIXES = ["/home", "/memorials", "/preview", "/settings"];
const ADMIN_PREFIXES = ["/admin"];

function isFamilyPath(pathname: string) {
  return FAMILY_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isAdminPath(pathname: string) {
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) return false;
  return ADMIN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  if (pathname.startsWith("/memorials") || pathname.startsWith("/c/") || pathname.startsWith("/preview")) {
    requestHeaders.set("Permissions-Policy", "camera=(self), microphone=(self), geolocation=()");
  }

  const hasAuthCookie =
    Boolean(request.cookies.get("lm-session")) ||
    Boolean(request.cookies.get("sb-access-token")) ||
    [...request.cookies.getAll()].some((cookie) => cookie.name.includes("-auth-token"));

  if (isFamilyPath(pathname) && !hasAuthCookie) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (isAdminPath(pathname) && !hasAuthCookie) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
