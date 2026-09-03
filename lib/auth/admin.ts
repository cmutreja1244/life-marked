import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export function createSupabaseAdminClient(): SupabaseClient | null {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) return null;
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function findUserByEmail(admin: SupabaseClient, email: string): Promise<User | null> {
  for (let page = 1; page <= 5; page += 1) {
    const listed = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (listed.error) throw listed.error;
    const match = listed.data.users.find((user) => user.email?.toLowerCase() === email);
    if (match) return match;
    if (listed.data.users.length < 200) return null;
  }
  return null;
}

export async function issueConfirmedEmailOtp(email: string): Promise<string> {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Sign-in is not configured.");

  const created = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (created.error && !/already|registered|exists/i.test(created.error.message)) {
    throw created.error;
  }

  const user = created.data.user ?? (await findUserByEmail(admin, email));
  if (user && !user.email_confirmed_at) {
    await admin.auth.admin.updateUserById(user.id, { email_confirm: true });
  }

  const generated = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (generated.error || !generated.data?.properties?.email_otp) {
    throw generated.error ?? new Error("Could not create a sign-in code.");
  }

  return generated.data.properties.email_otp;
}
