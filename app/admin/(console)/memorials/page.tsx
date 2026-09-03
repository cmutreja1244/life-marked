import Link from "next/link";
import { adminStatusLabel } from "@/lib/platform/lifecycle";
import { store } from "@/lib/platform/store";

export default function AdminMemorialsPage() {
  const memorials = store.listMemorials();
  return (
    <main>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Memorials</h1>
          <p className="mt-2 text-sm text-warm-grey">Open a memorial to view the live page, invite the family, or make a version live.</p>
        </div>
        <Link href="/admin/memorials/new" className="btn-primary shrink-0">
          New memorial
        </Link>
      </div>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-warm text-warm-grey">
            <th className="py-2">Name</th>
            <th>Status</th>
            <th>Marker code</th>
            <th>Family owner</th>
          </tr>
        </thead>
        <tbody>
          {memorials.map((memorial) => {
            const owner = store.members.find((member) => member.memorialId === memorial.id && member.role === "owner");
            const ownerProfile = owner ? store.profiles.get(owner.userId) : null;
            return (
              <tr key={memorial.id} className="border-b border-border-warm">
                <td className="py-3">
                  <Link href={`/admin/memorials/${memorial.id}`} className="text-link">
                    {memorial.fullName || "Untitled"}
                  </Link>
                </td>
                <td>{adminStatusLabel(memorial.status)}</td>
                <td className="font-mono">{memorial.publicToken}</td>
                <td>{ownerProfile?.email ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
