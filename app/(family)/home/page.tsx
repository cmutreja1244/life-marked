import Link from "next/link";
import { store } from "@/lib/platform/store";
import { getSession } from "@/lib/auth/session";
import { familyStatusLabel } from "@/lib/platform/lifecycle";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const memorials = store.memorialsForUser(session.user.id);

  return (
    <main className="mx-auto max-w-[76rem] px-5 py-12 md:px-10">
      <h1 className="font-serif text-4xl">Your memorials</h1>
      <p className="mt-3 text-warm-grey">Continue a life story, or preview how it will appear.</p>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {memorials.length === 0 ? (
          <li className="rounded-lg border border-border-warm p-6 text-warm-grey">
            You have not been invited to a memorial yet. If you were sent an email, open the link
            from that message.
          </li>
        ) : (
          memorials.map((memorial) => (
            <li key={memorial.id} className="rounded-lg border border-border-warm p-6">
              <p className="section-label">{familyStatusLabel(memorial.status)}</p>
              <h2 className="mt-2 font-serif text-2xl">{memorial.fullName || "Untitled memorial"}</h2>
              <p className="mt-2 text-sm text-warm-grey">Updated {new Date(memorial.updatedAt).toLocaleString("en-GB")}</p>
              <div className="mt-5 flex gap-3">
                <Link href={`/memorials/${memorial.id}/overview`} className="btn-primary">
                  Continue
                </Link>
                <Link href={`/preview/${memorial.id}`} className="text-link self-center">
                  Preview
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
