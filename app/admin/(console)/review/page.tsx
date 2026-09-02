import Link from "next/link";
import { store } from "@/lib/platform/store";
import { adminPublish, adminRequestChanges } from "@/lib/admin/actions";

export default function ReviewQueuePage() {
  const queue = store.listMemorials().filter((row) => row.status === "in_review");
  return (
    <main>
      <h1 className="font-serif text-3xl">Review</h1>
      <ul className="mt-8 space-y-4">
        {queue.map((memorial) => (
          <li key={memorial.id} className="rounded-lg border border-border-warm bg-ivory p-5">
            <Link href={`/admin/memorials/${memorial.id}`} className="font-serif text-2xl text-link">
              {memorial.fullName}
            </Link>
            <div className="mt-4 flex gap-3">
              <form action={adminPublish.bind(null, memorial.id)}>
                <button className="btn-primary" type="submit">
                  Publish
                </button>
              </form>
              <form action={adminRequestChanges.bind(null, memorial.id)}>
                <input type="hidden" name="note" value="Please review the latest edits." />
                <button className="text-link" type="submit">
                  Request changes
                </button>
              </form>
            </div>
          </li>
        ))}
        {queue.length === 0 ? <p className="text-warm-grey">Nothing waiting.</p> : null}
      </ul>
    </main>
  );
}
