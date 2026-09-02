import { adminPasswordLogin } from "@/lib/auth/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <h1 className="font-serif text-4xl">Staff sign in</h1>
      <form action={adminPasswordLogin} className="mt-8 space-y-4">
        <label className="block text-sm">
          Email
          <input name="email" type="email" required className="input-field mt-2" />
        </label>
        <label className="block text-sm">
          Password
          <input name="password" type="password" required className="input-field mt-2" />
        </label>
        <input type="hidden" name="next" value={next ?? "/admin"} />
        <button className="btn-primary w-full" type="submit">
          Continue
        </button>
      </form>
    </main>
  );
}
