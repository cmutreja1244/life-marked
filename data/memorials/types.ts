export type TimelineItem = {
  year: string;
  title: string;
  detail: string;
};

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  layout: "landscape" | "portrait" | "pair" | "wide" | "standard";
};

export type Memory = {
  quote: string;
  author: string;
};

export type VoiceMemory = {
  label: string;
  title: string;
  recorded: string;
  duration: string;
  image: string;
  imageAlt: string;
  supportingText: string;
};

export type SignificantPlace = {
  heading: string;
  location: string;
  text: string;
  image: string;
  imageAlt: string;
  caption: string;
};

export type Memorial = {
  slug: string;
  firstName: string;
  fullName: string;
  birthYear: number;
  deathYear: number;
  years: string;
  heroImage: string;
  heroImageAlt: string;
  openingLine: string;
  intro: string;
  biography: string[];
  pullQuote: string;
  storyImages: {
    src: string;
    alt: string;
    caption: string;
  }[];
  timeline: TimelineItem[];
  gallery: GalleryItem[];
  memories: Memory[];
  favouriteThings: string[];
  voiceMemory: VoiceMemory;
  places: SignificantPlace[];
  closingHeading: string;
  closingText: string;
};
