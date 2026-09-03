import { adminVerifyMfa } from "@/lib/auth/actions";
import { BrandMark } from "@/components/brand/BrandMark";
import { PendingSubmit } from "@/components/ui/PendingSubmit";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AdminMfaPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (!session?.user.isAdmin) redirect("/admin/login");
  const { next } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <BrandMark href="/admin" />
      <h1 className="mt-10 font-serif text-4xl">Authenticator</h1>
      <p className="mt-3 text-warm-grey">Enter the 6-digit code from your authenticator app.</p>
      <form action={adminVerifyMfa} className="mt-8 space-y-4">
        <input name="code" inputMode="numeric" required minLength={6} maxLength={6} className="input-field" />
        <input type="hidden" name="next" value={next ?? "/admin"} />
        <PendingSubmit className="btn-primary w-full" pendingLabel="Checking...">
          Confirm
        </PendingSubmit>
      </form>
    </main>
  );
}
