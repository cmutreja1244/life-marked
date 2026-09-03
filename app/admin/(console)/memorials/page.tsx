import Link from "next/link";
import { PublishedToggle } from "@/components/admin/PublishedToggle";
import { adminStatusLabel, isMemorialLive } from "@/lib/platform/lifecycle";
import { store } from "@/lib/platform/store";

export default function AdminMemorialsPage() {
  const memorials = store.listMemorials();
  return (
    <main>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Memorials</h1>
          <p className="mt-2 text-sm text-warm-grey">
            Turn a memorial on to make it live, or off to hide it from visitors and QR scans.
          </p>
        </div>
        <Link href="/admin/memorials/new" className="btn-primary shrink-0">
          New memorial
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-warm text-warm-grey">
              <th className="py-2">Name</th>
              <th>Status</th>
              <th>Published</th>
              <th>Marker code</th>
              <th>Family owner</th>
            </tr>
          </thead>
          <tbody>
            {memorials.map((memorial) => {
              const owner = store.members.find((member) => member.memorialId === memorial.id && member.role === "owner");
              const ownerProfile = owner ? store.profiles.get(owner.userId) : null;
              const live = isMemorialLive(memorial);
              return (
                <tr key={memorial.id} className="border-b border-border-warm">
                  <td className="py-3 pr-4">
                    <Link href={`/admin/memorials/${memorial.id}`} className="text-link">
                      {memorial.fullName || "Untitled"}
                    </Link>
                  </td>
                  <td className="pr-4">{adminStatusLabel(memorial.status)}</td>
                  <td className="pr-4">
                    <PublishedToggle memorialId={memorial.id} live={live} name={memorial.fullName || "this memorial"} />
                  </td>
                  <td className="pr-4 font-mono">{memorial.publicToken}</td>
                  <td>{ownerProfile?.email ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
