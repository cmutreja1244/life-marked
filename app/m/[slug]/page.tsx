import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavouriteThings } from "@/components/memorial/FavouriteThings";
import { LifeStory } from "@/components/memorial/LifeStory";
import { MemorialClose } from "@/components/memorial/MemorialClose";
import { MemorialFooter } from "@/components/memorial/MemorialFooter";
import { MemorialGallery } from "@/components/memorial/MemorialGallery";
import { MemorialHero } from "@/components/memorial/MemorialHero";
import { MemorialTimeline } from "@/components/memorial/MemorialTimeline";
import { MemorialTopBar } from "@/components/memorial/MemorialTopBar";
import { MemoryQuotes } from "@/components/memorial/MemoryQuotes";
import { SignificantPlace } from "@/components/memorial/SignificantPlace";
import { VoiceMemory } from "@/components/memorial/VoiceMemory";
import { getMemorial, getMemorialSlugs } from "@/data/memorials";

type MemorialPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getMemorialSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: MemorialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const memorial = getMemorial(slug);

  if (!memorial) {
    return { title: "Memorial" };
  }

  const description =
    "A fictional LifeMarked memorial demonstrating how photographs, memories, milestones and voice can preserve the story behind a life.";

  return {
    title: `${memorial.fullName} (${memorial.birthYear}–${memorial.deathYear}) | LifeMarked Demo`,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${memorial.fullName} (${memorial.birthYear}–${memorial.deathYear}) | LifeMarked Demo`,
      description,
      images: [{ url: memorial.heroImage }],
    },
  };
}

export default async function MemorialPage({ params }: MemorialPageProps) {
  const { slug } = await params;
  const memorial = getMemorial(slug);

  if (!memorial) notFound();

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <MemorialTopBar
        shareTitle={memorial.fullName}
        shareText={`${memorial.fullName}, ${memorial.years}`}
      />
      <main>
        <MemorialHero memorial={memorial} />
        <LifeStory memorial={memorial} />
        <MemorialTimeline memorial={memorial} />
        <MemorialGallery memorial={memorial} />
        <FavouriteThings memorial={memorial} />
        <MemoryQuotes memorial={memorial} />
        <VoiceMemory memorial={memorial} />
        <SignificantPlace memorial={memorial} />
        <MemorialClose memorial={memorial} />
      </main>
      <MemorialFooter />
    </div>
  );
}
