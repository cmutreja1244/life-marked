import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { MemorialUnavailable, PublicMemorial } from "@/components/memorial/PublicMemorial";
import { lookupPublishedMemorial } from "@/lib/memorials/lookup";
import { memorialUrl } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await lookupPublishedMemorial({ slug });
  if (result.outcome !== "ok") {
    return { title: "Memorial", robots: { index: false, follow: false } };
  }
  return {
    title: `${result.snapshot.fullName} | LifeMarked`,
    description: result.snapshot.openingLine || result.snapshot.intro,
    robots: result.indexable ? { index: true, follow: true } : { index: false, follow: false },
    alternates: { canonical: memorialUrl(result.canonicalSlug) },
    openGraph: result.visibility === "private"
      ? undefined
      : {
          title: result.snapshot.fullName,
          description: result.snapshot.openingLine,
          images: result.snapshot.heroImage ? [{ url: result.snapshot.heroImage }] : undefined,
        },
  };
}

export default async function MemorialSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await lookupPublishedMemorial({ slug });
  if (result.outcome === "not_found") notFound();
  if (result.outcome === "unavailable") return <MemorialUnavailable />;
  if (result.canonicalSlug && result.canonicalSlug !== slug) {
    permanentRedirect(`/m/${result.canonicalSlug}`);
  }
  return <PublicMemorial snapshot={result.snapshot} canonicalUrl={memorialUrl(result.canonicalSlug)} />;
}
