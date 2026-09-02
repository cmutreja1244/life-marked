import Link from "next/link";
import { store } from "@/lib/platform/store";

export default function AdminMemorialsPage() {
  const memorials = store.listMemorials();
  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Memorials</h1>
        <Link href="/admin/memorials/new" className="btn-primary">
          New memorial
        </Link>
      </div>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-warm text-warm-grey">
            <th className="py-2">Name</th>
            <th>Status</th>
            <th>Token</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {memorials.map((memorial) => (
            <tr key={memorial.id} className="border-b border-border-warm">
              <td className="py-3">
                <Link href={`/admin/memorials/${memorial.id}`} className="text-link">
                  {memorial.fullName || "Untitled"}
                </Link>
              </td>
              <td>{memorial.status}</td>
              <td className="font-mono">{memorial.publicToken}</td>
              <td>{memorial.ownerId ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
