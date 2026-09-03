import Link from "next/link";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { adminPublish, adminRequestChanges } from "@/lib/admin/actions";
import { store } from "@/lib/platform/store";

export default function ReviewQueuePage() {
  const queue = store.listMemorials().filter((row) => row.status === "in_review");
  return (
    <main className="max-w-3xl">
      <h1 className="font-serif text-3xl">Waiting for you to check</h1>
      <p className="mt-3 text-warm-grey">
        Families have said a memorial is ready. Open it to read the draft, then make it live or send it back. Making it
        live updates the public page immediately. Sending it back does not.
      </p>
      <ul className="mt-8 space-y-4">
        {queue.map((memorial) => (
          <li key={memorial.id} className="rounded-lg border border-border-warm bg-ivory p-5">
            <Link href={`/admin/memorials/${memorial.id}`} className="font-serif text-2xl text-link">
              {memorial.fullName}
            </Link>
            <p className="mt-2 text-sm text-warm-grey">
              Open the memorial for the full picture — live page, draft, and notes — before you decide.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/admin/memorials/${memorial.id}`} className="btn-secondary">
                Open memorial
              </Link>
              <form action={adminPublish.bind(null, memorial.id)}>
                <ConfirmSubmit message="Visitors and anyone who scans the QR code will immediately see the current draft. Continue?">
                  Make live
                </ConfirmSubmit>
              </form>
              <form action={adminRequestChanges.bind(null, memorial.id)}>
                <input type="hidden" name="note" value="Sent back from the review list." />
                <button className="btn-secondary" type="submit">
                  Send back
                </button>
              </form>
            </div>
          </li>
        ))}
        {queue.length === 0 ? <p className="text-warm-grey">Nothing waiting to be checked.</p> : null}
      </ul>
    </main>
  );
}
