import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env, hasSupabase } from "@/lib/env";
import { store, type PlatformRepository } from "@/lib/platform/store";
import type { Profile } from "@/lib/platform/types";
import { canEditMemorial, canManageAccess } from "@/lib/platform/ownership";

export const SESSION_COOKIE = "lm-session";

export type Session = {
  user: Profile;
  aal: "aal1" | "aal2";
};

export function getStore(): PlatformRepository {
  return store;
}

async function readSessionCookie(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Session;
    if (!parsed?.user?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  if (hasSupabase()) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    const overlay = await readSessionCookie();
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("is_admin, admin_role, display_name")
      .eq("id", data.user.id)
      .maybeSingle();
    const aalClaim = (data.user as { aal?: string }).aal;
    const aal =
      overlay?.user.id === data.user.id && overlay.aal === "aal2"
        ? "aal2"
        : aalClaim === "aal2" || data.user.app_metadata?.aal === "aal2"
          ? "aal2"
          : "aal1";
    const isAdmin = Boolean(data.user.app_metadata?.is_admin || profileRow?.is_admin);
    const profile: Profile = {
      id: data.user.id,
      email: data.user.email ?? "",
      displayName: profileRow?.display_name ?? data.user.user_metadata?.display_name ?? data.user.email ?? "",
      isAdmin,
      adminRole: isAdmin ? (profileRow?.admin_role ?? data.user.app_metadata?.admin_role ?? "operations") : null,
      totpSecret: isAdmin ? process.env.DEV_ADMIN_TOTP_SECRET : undefined,
      tosAcceptedAt: null,
      deletedAt: null,
    };
    store.upsertProfile(profile);
    return { user: profile, aal };
  }

  return readSessionCookie();
}

export async function setSession(session: Session) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, Buffer.from(JSON.stringify(session)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function requireFamily() {
  const session = await getSession();
  if (!session) throw new Error("Please sign in.");
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user.isAdmin) throw new Error("Please sign in as staff.");
  if (session.aal !== "aal2") throw new Error("Authenticator approval is required.");
  return session;
}

export async function requireMemorialAccess(memorialId: string, mode: "view" | "edit" | "manage" = "view") {
  const session = await getSession();
  if (!session) throw new Error("Please sign in.");
  const membership = store.membership(memorialId, session.user.id);
  const role = membership?.role ?? null;
  if (mode === "view" && !(session.user.isAdmin || role)) throw new Error("You do not have access to this memorial.");
  if (mode === "edit" && !canEditMemorial(role, session.user.isAdmin)) {
    throw new Error("You do not have permission to edit this memorial.");
  }
  if (mode === "manage" && !canManageAccess(role, session.user.isAdmin)) {
    throw new Error("Only the owner can manage family access.");
  }
  return { session, role };
}

export async function createSupabaseServerClient() {
  if (!hasSupabase() || !env.supabaseUrl || !env.supabaseAnonKey) return null;
  const jar = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return jar.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => jar.set(name, value, options));
      },
    },
  });
}
