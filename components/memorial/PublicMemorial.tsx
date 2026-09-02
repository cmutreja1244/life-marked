import type { Memorial } from "@/data/memorials/types";
import type { PublishedSnapshot } from "@/lib/platform/snapshot";
import { FavouriteThings } from "./FavouriteThings";
import { LifeStory } from "./LifeStory";
import { MemorialClose } from "./MemorialClose";
import { MemorialFooter } from "./MemorialFooter";
import { MemorialGallery } from "./MemorialGallery";
import { MemorialHero } from "./MemorialHero";
import { MemorialTimeline } from "./MemorialTimeline";
import { MemorialTopBar } from "./MemorialTopBar";
import { MemoryQuotes } from "./MemoryQuotes";
import { SignificantPlace } from "./SignificantPlace";
import { VoiceMemory } from "./VoiceMemory";

export function snapshotToMemorial(snapshot: PublishedSnapshot): Memorial {
  return {
    slug: snapshot.slug,
    firstName: snapshot.firstName,
    fullName: snapshot.fullName,
    birthYear: Number(snapshot.years.slice(0, 4)) || 0,
    deathYear: Number(snapshot.years.slice(-4)) || 0,
    years: snapshot.years,
    heroImage: snapshot.heroImage,
    heroImageAlt: snapshot.heroImageAlt,
    isDemo: snapshot.isDemo,
    openingLine: snapshot.openingLine,
    intro: snapshot.intro,
    biography: snapshot.biography,
    pullQuote: snapshot.pullQuote,
    storyImages: snapshot.storyImages,
    timeline: snapshot.timeline,
    gallery: snapshot.gallery,
    memories: snapshot.memories,
    favouriteThings: snapshot.favouriteThings,
    voiceMemory: snapshot.voiceMemory
      ? {
          label: snapshot.voiceMemory.label,
          title: snapshot.voiceMemory.title,
          recorded: snapshot.voiceMemory.recorded,
          duration: snapshot.voiceMemory.duration,
          image: snapshot.voiceMemory.image,
          imageAlt: snapshot.voiceMemory.imageAlt,
          supportingText: snapshot.voiceMemory.supportingText,
          audioSrc: snapshot.voiceMemory.audioSrc,
          waveform: snapshot.voiceMemory.waveform ?? undefined,
        }
      : {
          label: "",
          title: "",
          recorded: "",
          duration: "",
          image: null,
          imageAlt: "",
          supportingText: "",
        },
    places: snapshot.places.map((place) => ({
      heading: place.heading,
      location: place.location,
      text: place.text,
      image: place.image,
      imageAlt: place.imageAlt,
      caption: place.caption,
    })),
    closingHeading: snapshot.closingHeading,
    closingText: snapshot.closingText,
  };
}

export function PublicMemorial({ snapshot }: { snapshot: PublishedSnapshot; canonicalUrl?: string }) {
  const memorial = snapshotToMemorial(snapshot);
  const enabled = new Set(snapshot.enabledSections);

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <MemorialTopBar shareTitle={memorial.fullName} shareText={`${memorial.fullName}, ${memorial.years}`} />
      <main>
        {enabled.has("hero") ? <MemorialHero memorial={memorial} /> : null}
        {enabled.has("story") ? <LifeStory memorial={memorial} /> : null}
        {enabled.has("timeline") ? <MemorialTimeline memorial={memorial} /> : null}
        {enabled.has("gallery") ? <MemorialGallery memorial={memorial} /> : null}
        {enabled.has("favourites") ? <FavouriteThings memorial={memorial} /> : null}
        {enabled.has("memories") ? <MemoryQuotes memorial={memorial} /> : null}
        {enabled.has("voice") && snapshot.voiceMemory ? <VoiceMemory memorial={memorial} /> : null}
        {enabled.has("video") && snapshot.video?.src ? (
          <section className="bg-ivory px-5 py-12 md:px-10 md:py-16">
            <div className="mx-auto max-w-[76rem]">
              <p className="section-label">Video</p>
              <h2 className="mt-3 font-serif text-3xl">{snapshot.video.title}</h2>
              <div className="mt-6 aspect-video overflow-hidden img-radius bg-charcoal">
                <video
                  title={snapshot.video.title}
                  src={snapshot.video.src}
                  poster={snapshot.video.poster ?? undefined}
                  controls
                  playsInline
                  className="h-full w-full"
                />
              </div>
            </div>
          </section>
        ) : null}
        {enabled.has("places") ? <SignificantPlace memorial={memorial} /> : null}
        {enabled.has("close") ? <MemorialClose memorial={memorial} /> : null}
      </main>
      <MemorialFooter isDemo={snapshot.isDemo} publicToken={snapshot.publicToken} />
    </div>
  );
}

export function MemorialUnavailable() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <h1 className="font-serif text-3xl text-charcoal">This memorial is temporarily unavailable.</h1>
      <p className="mt-4 max-w-md text-warm-grey">Please try again later.</p>
    </div>
  );
}
