"use client";

import Image from "next/image";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

const timeline = [
  { year: "1941", event: "Born in Edinburgh." },
  { year: "1963", event: "Married James." },
  { year: "1968", event: "Moved into their first family home." },
  { year: "1985", event: "Opened Campbell Florists." },
  { year: "1999", event: "Welcomed her first grandchild." },
  { year: "2012", event: "Travelled through Italy." },
  { year: "2025", event: "Remembered by three generations." },
];

const gallery = [
  { src: "/images/margaret/portrait.png", alt: "Portrait of Margaret Eleanor Campbell" },
  { src: "/images/margaret/wedding.png", alt: "Margaret and James on their wedding day" },
  { src: "/images/margaret/family-1.png", alt: "Margaret with her family" },
  { src: "/images/margaret/travel.png", alt: "Margaret travelling in Italy" },
  { src: "/images/margaret/candid.png", alt: "Margaret in her garden" },
];

const memories = [
  "Gran never let anyone leave her house hungry.",
  "She knew every flower by its Latin name — and its favourite spot in the sun.",
  "Sunday afternoons meant Ella on the gramophone and letters to her sister in Glasgow.",
];

const favourites = [
  "Sunday roast",
  "Gardening",
  "Florence",
  "Ella Fitzgerald",
  "Handwritten letters",
];

type MemorialDemoProps = {
  embedded?: boolean;
};

export function MemorialDemo({ embedded = false }: MemorialDemoProps) {
  return (
    <article
      className={`overflow-hidden editorial-border bg-[#faf8f4] ${embedded ? "" : "section-padding"}`}
      aria-label="Margaret Eleanor Campbell memorial concept preview"
    >
      {!embedded && (
        <div className="content-width mx-auto mb-8 px-5 md:px-10">
          <span className="section-label">Concept preview</span>
        </div>
      )}

      <div className="relative aspect-[16/9] max-h-[520px] w-full md:aspect-[21/9]">
        <Image
          src="/images/margaret/portrait.png"
          alt=""
          fill
          className="object-cover object-[center_20%]"
          sizes="100vw"
          priority={embedded}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/75 via-deep-charcoal/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <p className="section-label text-ivory/70">Margaret Eleanor Campbell</p>
          <h3 className="mt-2 font-serif text-3xl text-ivory md:text-4xl">
            Margaret Eleanor Campbell
          </h3>
          <p className="mt-2 text-ivory/80">1941 — 2025</p>
          <p className="mt-4 max-w-md font-serif text-xl text-ivory/95 md:text-2xl">
            Margaret made every room feel warmer.
          </p>
        </div>
      </div>

      <div className="content-width mx-auto grid gap-12 px-5 py-12 md:grid-cols-[1fr_1.2fr] md:gap-16 md:px-10 md:py-16">
        <div>
          <h4 className="font-serif text-xl text-charcoal">Biography</h4>
          <div className="prose-width mt-6 space-y-4 text-warm-grey">
            <p>
              Margaret was born in Edinburgh during the winter of 1941, the eldest
              of three sisters. She carried that eldest-sister steadiness through
              every chapter of her life — calm, attentive, quietly determined.
            </p>
            <p>
              With James, she built a home filled with flowers, music and long
              conversations at the kitchen table. Campbell Florists, which she
              opened in 1985, became a gathering place as much as a business.
            </p>
            <p>
              She travelled when she could, gardened whenever she was home, and
              wrote letters the way other people breathe — regularly, without
              thinking about it.
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xl text-charcoal">Timeline</h4>
          <ol className="mt-6 space-y-5">
            {timeline.map((item) => (
              <li key={item.year} className="grid grid-cols-[4rem_1fr] gap-4 border-b border-border-warm pb-5 last:border-0">
                <span className="font-serif text-lg text-bronze">{item.year}</span>
                <span className="text-warm-grey">{item.event}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="content-width mx-auto px-5 pb-12 md:px-10 md:pb-16">
        <h4 className="font-serif text-xl text-charcoal">Gallery</h4>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {gallery.map((img) => (
            <div key={img.src} className="relative aspect-[3/4] overflow-hidden editorial-border">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="200px" />
            </div>
          ))}
        </div>
      </div>

      <div className="content-width mx-auto grid gap-10 px-5 pb-12 md:grid-cols-3 md:px-10 md:pb-16">
        <div className="editorial-border bg-ivory p-6">
          <p className="section-label">Voice</p>
          <p className="mt-4 font-serif text-lg text-charcoal">
            Hear Margaret tell the story of how she met James
          </p>
          <button
            type="button"
            className="mt-6 flex w-full items-center gap-4 border-t border-border-warm pt-6 text-left"
            onClick={() => trackEvent(ANALYTICS_EVENTS.demoAudioClicked)}
            aria-label="Play audio preview — concept only, no audio file"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal text-charcoal">
              ▶
            </span>
            <span className="text-sm text-warm-grey">Concept preview — audio not yet available</span>
          </button>
        </div>

        <div className="relative aspect-video overflow-hidden editorial-border md:col-span-1">
          <Image
            src="/images/margaret/candid.png"
            alt="Archival video thumbnail — concept preview"
            fill
            className="object-cover"
            sizes="400px"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-deep-charcoal/30">
            <span className="rounded-full border border-ivory/80 px-4 py-2 text-sm text-ivory">
              Archival video — concept
            </span>
          </div>
        </div>

        <div>
          <p className="section-label">Memories</p>
          <ul className="mt-4 space-y-4">
            {memories.map((memory) => (
              <li key={memory} className="font-serif text-lg leading-snug text-charcoal">
                &ldquo;{memory}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="content-width mx-auto border-t border-border-warm px-5 py-10 md:px-10">
        <p className="section-label">Favourite things</p>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {favourites.map((item) => (
            <li key={item} className="font-serif text-xl text-charcoal">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
