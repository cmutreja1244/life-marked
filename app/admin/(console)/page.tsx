import Link from "next/link";
import { store } from "@/lib/platform/store";

export default function AdminHomePage() {
  const memorials = store.listMemorials();
  const review = memorials.filter((row) => row.status === "in_review").length;
  const quarantined = [...store.media.values()].filter((asset) => asset.status === "quarantined").length;
  const needsAttention = [...store.media.values()].filter((asset) =>
    ["scanning", "quarantined", "failed"].includes(asset.status),
  ).length;

  return (
    <main>
      <h1 className="font-serif text-3xl">Operations</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Memorials" value={memorials.length} href="/admin/memorials" />
        <Stat label="In review" value={review} href="/admin/review" />
        <Stat label="Quarantined" value={quarantined} href="/admin/media" />
        <Stat label="Needs attention" value={needsAttention} href="/admin/media" />
      </div>
    </main>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-lg border border-border-warm bg-ivory p-5">
      <p className="text-sm text-warm-grey">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </Link>
  );
}
