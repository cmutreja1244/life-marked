import { store } from "@/lib/platform/store";

export default function ReportsPage() {
  return (
    <main>
      <h1 className="font-serif text-3xl">Reports</h1>
      <ul className="mt-8 space-y-4">
        {store.reports.map((report) => (
          <li key={report.id} className="rounded-lg border border-border-warm bg-ivory p-5">
            <p className="text-sm text-warm-grey">{report.createdAt} · {report.status}</p>
            <p className="mt-2">{report.body}</p>
          </li>
        ))}
        {store.reports.length === 0 ? <p className="text-warm-grey">No reports.</p> : null}
      </ul>
    </main>
  );
}
