import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemorialUnavailable, PublicMemorial } from "@/components/memorial/PublicMemorial";
import { lookupPublishedMemorial } from "@/lib/memorials/lookup";
import { memorialUrl } from "@/lib/site";
import { store } from "@/lib/platform/store";

type PageProps = { params: Promise<{ token: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const result = await lookupPublishedMemorial({ token });
  if (result.outcome !== "ok") {
    return {
      title: "Memorial",
      robots: { index: false, follow: false },
      other: { "cache-control": "no-store" },
    };
  }
  return {
    title: `${result.snapshot.fullName} | LifeMarked`,
    description: result.snapshot.openingLine || result.snapshot.intro,
    robots: { index: false, follow: false },
    alternates: { canonical: memorialUrl(result.canonicalSlug) },
  };
}

export default async function QrMemorialPage({ params }: PageProps) {
  const { token } = await params;
  store.incrementScan(token);
  const result = await lookupPublishedMemorial({ token });
  if (result.outcome === "not_found") notFound();
  if (result.outcome === "unavailable") return <MemorialUnavailable />;
  return <PublicMemorial snapshot={result.snapshot} canonicalUrl={memorialUrl(result.canonicalSlug)} />;
}
