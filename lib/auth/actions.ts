"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient, getSession, setSession, clearSession } from "@/lib/auth/session";
import { verifyTotp } from "@/lib/auth/totp";
import { hasSupabase } from "@/lib/env";
import { store } from "@/lib/platform/store";
import type { Profile } from "@/lib/platform/types";
import { rateLimit } from "@/lib/rate-limit";

function profileFromEmail(email: string, isAdmin = false): Profile {
  const existing = store.getProfileByEmail(email);
  if (existing) return existing;
  const profile: Profile = {
    id: globalThis.crypto.randomUUID(),
    email: email.toLowerCase(),
    displayName: email.split("@")[0] ?? email,
    isAdmin,
    adminRole: isAdmin ? "operations" : null,
    totpSecret: isAdmin ? process.env.DEV_ADMIN_TOTP_SECRET ?? "JBSWY3DPEHPK3PXP" : undefined,
    passwordHash: isAdmin ? process.env.DEV_ADMIN_PASSWORD : undefined,
    tosAcceptedAt: null,
    deletedAt: null,
  };
  store.upsertProfile(profile);
  return profile;
}

export async function sendFamilyOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) throw new Error("Please enter a valid email address.");
  const limited = await rateLimit("otp", email, 5, 10 * 60 * 1000);
  if (!limited.success) throw new Error("Please wait a moment before requesting another code.");

  const next = String(formData.get("next") ?? "/home");
  if (hasSupabase()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase!.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw new Error(error.message);
    redirect(`/login?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`);
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  store.setOtp(email, code);
  if (process.env.NODE_ENV !== "production") {
    console.info(`[dev otp] ${email} ${code}`);
  }
  redirect(`/login?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`);
}

export async function verifyFamilyOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const code = String(formData.get("code") ?? "").trim();
  const next = String(formData.get("next") ?? "/home");

  if (hasSupabase()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase!.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) throw new Error("That code did not match. Please try again.");
    redirect(next.startsWith("/") ? next : "/home");
  }

  if (!store.verifyOtp(email, code)) {
    throw new Error("That code did not match. Please try again.");
  }
  const user = profileFromEmail(email, false);
  await setSession({ user, aal: "aal1" });
  redirect(next.startsWith("/") ? next : "/home");
}

export async function adminPasswordLogin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const limited = await rateLimit("admin-login", email, 8, 10 * 60 * 1000);
  if (!limited.success) throw new Error("Please wait a moment before trying again.");

  if (hasSupabase()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) throw new Error("Those details did not match.");
    redirect(`/admin/login/mfa?next=${encodeURIComponent(next)}`);
  }

  const expected = process.env.DEV_ADMIN_PASSWORD;
  if (!expected || password !== expected || email !== (process.env.DEV_ADMIN_EMAIL ?? email)) {
    throw new Error("Those details did not match.");
  }
  if (process.env.DEV_ADMIN_EMAIL && email !== process.env.DEV_ADMIN_EMAIL.toLowerCase()) {
    throw new Error("Those details did not match.");
  }
  const user = profileFromEmail(email, true);
  await setSession({ user, aal: "aal1" });
  redirect(`/admin/login/mfa?next=${encodeURIComponent(next)}`);
}

export async function adminVerifyMfa(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();
  const next = String(formData.get("next") ?? "/admin");
  const session = await getSession();
  if (!session?.user.isAdmin) throw new Error("Please sign in as staff.");
  const secret = session.user.totpSecret ?? process.env.DEV_ADMIN_TOTP_SECRET ?? "JBSWY3DPEHPK3PXP";
  const ok = await verifyTotp(secret, code);
  if (!ok) throw new Error("That authenticator code did not match.");
  await setSession({ user: session.user, aal: "aal2" });
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut() {
  if (hasSupabase()) {
    const supabase = await createSupabaseServerClient();
    await supabase?.auth.signOut();
  }
  await clearSession();
  redirect("/");
}
