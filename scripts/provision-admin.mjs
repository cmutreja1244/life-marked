import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL ?? "support@lifemarked.co.uk";
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!password) {
  console.error("Missing ADMIN_PASSWORD");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: existing } = await supabase.auth.admin.listUsers();
const already = existing.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

let userId = already?.id;
if (already) {
  const { error } = await supabase.auth.admin.updateUserById(already.id, {
    password,
    email_confirm: true,
    app_metadata: { ...already.app_metadata, is_admin: true, admin_role: "super_admin" },
  });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { is_admin: true, admin_role: "super_admin" },
    user_metadata: { display_name: "LifeMarked staff" },
  });
  if (error || !data.user) {
    console.error(error?.message ?? "Create user failed");
    process.exit(1);
  }
  userId = data.user.id;
}

const { error: profileError } = await supabase.from("profiles").upsert({
  id: userId,
  email,
  display_name: "LifeMarked staff",
  is_admin: true,
  admin_role: "super_admin",
});
if (profileError) {
  console.error(profileError.message);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, email, userId, created: !already }));
