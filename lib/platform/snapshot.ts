import type { MediaKind, MediaStatus, SectionKey } from "./enums";
import { canPublishAsset } from "./media-state";
import type { TipTapNode } from "./tiptap";
import { tiptapToParagraphs } from "./tiptap";
import { formatYearSpan } from "./fuzzy-dates";
import type { FuzzyDate } from "./fuzzy-dates";

export type SnapshotMedia = {
  id: string;
  kind: MediaKind;
  status: MediaStatus;
  publicUrl: string | null;
  altText: string;
  caption: string;
  focalX: number | null;
  focalY: number | null;
  durationLabel: string | null;
  waveform: number[] | null;
};

export type PublishedSnapshot = {
  memorialId: string;
  publicToken: string;
  slug: string;
  isDemo: boolean;
  visibility: "unlisted" | "public" | "private";
  indexable: boolean;
  firstName: string;
  fullName: string;
  years: string;
  openingLine: string;
  intro: string;
  biography: string[];
  pullQuote: string;
  heroImage: string | null;
  heroImageAlt: string;
  heroFocalY: number;
  storyImages: Array<{ src: string; alt: string; caption: string }>;
  timeline: Array<{ year: string; title: string; detail: string }>;
  gallery: Array<{
    src: string;
    alt: string;
    caption: string;
    layout: "landscape" | "portrait" | "pair" | "wide" | "standard";
  }>;
  memories: Array<{ quote: string; author: string }>;
  favouriteThings: string[];
  voiceMemory: {
    label: string;
    title: string;
    recorded: string;
    duration: string;
    image: string | null;
    imageAlt: string;
    supportingText: string;
    audioSrc: string | null;
    waveform: number[] | null;
  } | null;
  video: {
    title: string;
    src: string | null;
    poster: string | null;
  } | null;
  places: Array<{
    heading: string;
    location: string;
    text: string;
    image: string | null;
    imageAlt: string;
    caption: string;
  }>;
  closingHeading: string;
  closingText: string;
  enabledSections: SectionKey[];
  assetIds: string[];
};

export type WorkingCopy = {
  memorialId: string;
  publicToken: string;
  slug: string;
  isDemo: boolean;
  visibility: "unlisted" | "public" | "private";
  indexOptIn: boolean;
  firstName: string;
  fullName: string;
  birth: FuzzyDate | null;
  death: FuzzyDate | null;
  openingLine: string;
  intro: string;
  story: TipTapNode | null;
  biography: string[];
  pullQuote: string;
  closingHeading: string;
  closingText: string;
  heroAssetId: string | null;
  heroImageAlt: string;
  heroFocalY: number;
  storyImages: Array<{ assetId: string; alt: string; caption: string }>;
  timeline: Array<{ year: string; title: string; detail: string }>;
  gallery: Array<{
    assetId: string;
    alt: string;
    caption: string;
    layout: "landscape" | "portrait" | "pair" | "wide" | "standard";
  }>;
  memories: Array<{ quote: string; author: string; status: "approved" | "pending" | "rejected" }>;
  favouriteThings: string[];
  voice: {
    label: string;
    title: string;
    recorded: string;
    supportingText: string;
    assetId: string | null;
    imageAssetId: string | null;
    imageAlt: string;
  } | null;
  video: { title: string; assetId: string | null; posterAssetId: string | null } | null;
  places: Array<{
    heading: string;
    location: string;
    text: string;
    assetId: string | null;
    imageAlt: string;
    caption: string;
  }>;
  enabledSections: SectionKey[];
  media: SnapshotMedia[];
};

export function collectAssetIds(snapshot: PublishedSnapshot): string[] {
  return [...new Set(snapshot.assetIds)];
}

export function buildPublishedSnapshot(working: WorkingCopy): PublishedSnapshot {
  const byId = new Map(working.media.map((asset) => [asset.id, asset]));
  const assetIds: string[] = [];

  const resolve = (assetId: string | null | undefined): SnapshotMedia | null => {
    if (!assetId) return null;
    const asset = byId.get(assetId);
    if (!asset || !canPublishAsset(asset.status) || !asset.publicUrl) return null;
    assetIds.push(asset.id);
    return asset;
  };

  const biography = working.story ? tiptapToParagraphs(working.story) : working.biography;

  const hero = resolve(working.heroAssetId);
  const storyImages = working.storyImages
    .map((item) => {
      const asset = resolve(item.assetId);
      return asset ? { src: asset.publicUrl!, alt: item.alt, caption: item.caption } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const gallery = working.gallery
    .map((item) => {
      const asset = resolve(item.assetId);
      return asset
        ? { src: asset.publicUrl!, alt: item.alt, caption: item.caption, layout: item.layout }
        : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const memories = working.memories
    .filter((memory) => memory.status === "approved")
    .map(({ quote, author }) => ({ quote, author }));

  const voiceAsset = working.voice ? resolve(working.voice.assetId) : null;
  const voiceImage = working.voice ? resolve(working.voice.imageAssetId) : null;
  const videoAsset = working.video ? resolve(working.video.assetId) : null;
  const videoPoster = working.video ? resolve(working.video.posterAssetId) : null;

  const places = working.places.map((place) => {
    const image = resolve(place.assetId);
    return {
      heading: place.heading,
      location: place.location,
      text: place.text,
      image: image?.publicUrl ?? null,
      imageAlt: place.imageAlt,
      caption: place.caption,
    };
  });

  const enabled = new Set(working.enabledSections);
  const omitEmpty = (key: SectionKey, hasContent: boolean) => hasContent && enabled.has(key);

  const enabledSections = working.enabledSections.filter((key) => {
    switch (key) {
      case "hero":
        return true;
      case "story":
        return omitEmpty(key, Boolean(biography.length || working.intro));
      case "timeline":
        return omitEmpty(key, working.timeline.length > 0);
      case "gallery":
        return omitEmpty(key, gallery.length > 0);
      case "favourites":
        return omitEmpty(key, working.favouriteThings.length > 0);
      case "memories":
        return omitEmpty(key, memories.length > 0);
      case "voice":
        return omitEmpty(key, Boolean(working.voice));
      case "video":
        return omitEmpty(key, Boolean(working.video && videoAsset));
      case "places":
        return omitEmpty(key, places.length > 0);
      case "close":
        return omitEmpty(key, Boolean(working.closingText));
    }
  });

  return {
    memorialId: working.memorialId,
    publicToken: working.publicToken,
    slug: working.slug,
    isDemo: working.isDemo,
    visibility: working.visibility,
    indexable: working.visibility === "public" && working.indexOptIn && !working.isDemo,
    firstName: working.firstName,
    fullName: working.fullName,
    years: formatYearSpan(working.birth, working.death),
    openingLine: working.openingLine,
    intro: working.intro,
    biography,
    pullQuote: working.pullQuote,
    heroImage: hero?.publicUrl ?? null,
    heroImageAlt: working.heroImageAlt,
    heroFocalY: working.heroFocalY,
    storyImages,
    timeline: working.timeline,
    gallery,
    memories,
    favouriteThings: working.favouriteThings,
    voiceMemory: working.voice
      ? {
          label: working.voice.label,
          title: working.voice.title,
          recorded: working.voice.recorded,
          duration: voiceAsset?.durationLabel ?? "",
          image: voiceImage?.publicUrl ?? null,
          imageAlt: working.voice.imageAlt,
          supportingText: working.voice.supportingText,
          audioSrc: voiceAsset?.publicUrl ?? null,
          waveform: voiceAsset?.waveform ?? null,
        }
      : null,
    video: working.video
      ? {
          title: working.video.title,
          src: videoAsset?.publicUrl ?? null,
          poster: videoPoster?.publicUrl ?? null,
        }
      : null,
    places,
    closingHeading: working.closingHeading,
    closingText: working.closingText,
    enabledSections,
    assetIds: [...new Set(assetIds)],
  };
}

export function abortIfUnreadyReferenced(working: WorkingCopy) {
  const referenced = [
    working.heroAssetId,
    ...working.storyImages.map((item) => item.assetId),
    ...working.gallery.map((item) => item.assetId),
    working.voice?.assetId,
    working.voice?.imageAssetId,
    working.video?.assetId,
    working.video?.posterAssetId,
    ...working.places.map((place) => place.assetId),
  ].filter(Boolean) as string[];

  const byId = new Map(working.media.map((asset) => [asset.id, asset]));
  for (const id of referenced) {
    const asset = byId.get(id);
    if (asset && !canPublishAsset(asset.status)) {
      throw new Error("A photograph or recording is still being prepared. Wait until it is ready before publishing.");
    }
  }
}
