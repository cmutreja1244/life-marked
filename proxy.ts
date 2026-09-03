import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env, hasSupabase } from "@/lib/env";

const FAMILY_PREFIXES = ["/home", "/memorials", "/preview", "/settings"];
const ADMIN_PREFIXES = ["/admin"];

function isFamilyPath(pathname: string) {
  return FAMILY_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isAdminPath(pathname: string) {
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) return false;
  return ADMIN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function hasAuthCookie(request: NextRequest) {
  return (
    Boolean(request.cookies.get("lm-session")) ||
    Boolean(request.cookies.get("sb-access-token")) ||
    [...request.cookies.getAll()].some((cookie) => cookie.name.includes("-auth-token"))
  );
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie));
  return to;
}

async function refreshSupabaseSession(request: NextRequest, requestHeaders: Headers) {
  if (!hasSupabase() || !env.supabaseUrl || !env.supabaseAnonKey) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: requestHeaders } });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  if (pathname.startsWith("/memorials") || pathname.startsWith("/c/") || pathname.startsWith("/preview")) {
    requestHeaders.set("Permissions-Policy", "camera=(self), microphone=(self), geolocation=()");
  }

  const response = await refreshSupabaseSession(request, requestHeaders);

  if (isFamilyPath(pathname) && !hasAuthCookie(request)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return copyCookies(response, NextResponse.redirect(login));
  }

  if (isAdminPath(pathname) && !hasAuthCookie(request)) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return copyCookies(response, NextResponse.redirect(login));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
