import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <main className="mx-auto max-w-[40rem] px-5 py-12 md:px-10">
      <h1 className="font-serif text-4xl">Account</h1>
      <p className="mt-6 text-warm-grey">{session.user.email}</p>
      <p className="mt-8 text-warm-grey">
        Need help? Write to{" "}
        <a className="text-link" href="mailto:support@lifemarked.co.uk">
          support@lifemarked.co.uk
        </a>
        .
      </p>
    </main>
  );
}
