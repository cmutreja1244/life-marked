"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

const timeline = [
  { year: "1941", event: "Born in Edinburgh" },
  { year: "1963", event: "Married James after meeting him at a dance in Portobello" },
  { year: "1968", event: "Moved into their first family home" },
  { year: "1985", event: "Opened Campbell Florists" },
  { year: "1999", event: "Became \"Gran\" for the first time" },
  { year: "2012", event: "Finally made it to Florence" },
];

const memories = [
  { quote: "Gran never let anyone leave her house hungry.", author: "Sarah, granddaughter" },
  { quote: "She made ordinary Sundays feel like occasions.", author: "Sarah, granddaughter" },
];

const favourites = [
  "Sunday roast",
  "Gardening",
  "Florence",
  "Ella Fitzgerald",
  "Handwritten letters",
];

const gallery = [
  { src: "/images/margaret/wedding.webp", alt: "Margaret and James, 1963", caption: "Portobello, 1963", aspect: "aspect-[3/4]" },
  { src: "/images/margaret/florist.webp", alt: "Campbell Florists", caption: "Campbell Florists, 1985", aspect: "aspect-[4/3]" },
  { src: "/images/margaret/family-1.webp", alt: "Margaret with family", caption: "Edinburgh", aspect: "aspect-[5/4]" },
  { src: "/images/margaret/travel.webp", alt: "Margaret in Florence", caption: "Florence, 2012", aspect: "aspect-[16/10]" },
  { src: "/images/margaret/candid.webp", alt: "Margaret in her garden", caption: "Later years", aspect: "aspect-[3/4]" },
];

const waveformHeights = [8, 18, 12, 28, 22, 10, 32, 16, 24, 14, 26, 18, 30, 12, 20, 28, 14, 22, 16, 24];

function Waveform() {
  return (
    <div className="flex h-8 items-end gap-[2px]" aria-hidden>
      {waveformHeights.map((h, i) => (
        <div key={i} className="waveform-bar" style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}

type MemorialDemoProps = {
  onReturn?: () => void;
};

export function MemorialDemo({ onReturn }: MemorialDemoProps) {
  const reduceMotion = useReducedMotion();

  return (
    <article className="bg-memorial-cream" aria-label="Margaret Eleanor Campbell memorial concept preview">
      {/* Block A — Identity */}
      <div className="relative min-h-[70vh] md:min-h-[80vh]">
        <Image
          src="/images/margaret/portrait.webp"
          alt=""
          fill
          className="object-cover object-[center_18%]"
          sizes="(max-width: 768px) 100vw, 85vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/80 via-deep-charcoal/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 space-section-md">
          <div className="px-5 md:px-10">
            <h1 className="font-serif text-4xl text-ivory md:text-6xl">Margaret Eleanor Campbell</h1>
            <p className="mt-2 text-lg text-ivory/75">1941 — 2025</p>
            <p className="mt-5 max-w-lg font-serif text-xl text-ivory md:text-2xl">
              Margaret made every room feel warmer.
            </p>
          </div>
        </div>
      </div>

      {/* Biography — max ~120 words */}
      <div className="space-section-md px-5 md:px-10">
        <p className="reading-width mx-auto text-[1.05rem] leading-[1.75] text-warm-grey">
          Margaret was born in Edinburgh in 1941, the eldest of three sisters. She met James
          at a dance in Portobello and they made a home filled with music, flowers and
          conversation. Together they raised a family and, in 1985, opened Campbell Florists —
          a shop that became as much a meeting place as a business. Margaret gardened
          whenever she could, travelled to Florence in 2012, and became Gran to grandchildren
          who knew her kitchen as the warmest room in Edinburgh.
        </p>
      </div>

      {/* Timeline */}
      <div className="space-section-md px-5 md:px-10">
        <div className="mx-auto max-w-xl">
          <ol>
            {timeline.map((item, i) => (
              <li
                key={item.year}
                className={`grid grid-cols-[4.5rem_1fr] gap-5 py-6 ${i > 0 ? "border-t border-border-warm" : ""}`}
              >
                <span className="font-serif text-lg text-bronze">{item.year}</span>
                <span className="text-charcoal">{item.event}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Gallery — varied aspect ratios */}
      <div className="space-section-md px-5 md:px-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
          {gallery.map((img, i) => (
            <motion.figure
              key={img.src}
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`relative overflow-hidden ${img.aspect} ${
                i === 0 ? "col-span-2 row-span-2 md:col-span-2" :
                i === 3 ? "col-span-2 md:col-span-3" :
                "col-span-1 md:col-span-2"
              }`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="300px" />
              {img.caption && (
                <figcaption className="absolute bottom-2 left-2 text-[0.65rem] tracking-wide text-ivory/90">
                  {img.caption}
                </figcaption>
              )}
            </motion.figure>
          ))}
        </div>
      </div>

      {/* Audio */}
      <div className="space-section-md border-t border-border-warm bg-ivory px-5 md:px-10">
        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-[200px_1fr] md:items-start">
          <div className="relative aspect-square w-full max-w-[200px]">
            <Image
              src="/images/margaret/candid.webp"
              alt="Margaret, 1987"
              fill
              className="object-cover"
              sizes="200px"
            />
          </div>
          <div>
            <p className="section-label">Concept feature</p>
            <p className="mt-2 font-serif text-xl text-charcoal">Margaret, 1987</p>
            <h3 className="mt-1 font-serif text-2xl text-charcoal">How I met James</h3>
            <button
              type="button"
              className="mt-6 flex w-full items-center gap-4 border-t border-border-warm pt-6 text-left"
              onClick={() => trackEvent(ANALYTICS_EVENTS.demoAudioClicked)}
              aria-label="Play audio preview — concept only"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-charcoal text-charcoal">
                ▶
              </span>
              <div className="min-w-0 flex-1">
                <Waveform />
                <p className="mt-2 text-sm text-warm-grey">2:14</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Memories */}
      <div className="space-section-md px-5 md:px-10">
        <ul className="mx-auto max-w-xl space-y-8">
          {memories.map((m) => (
            <li key={m.quote}>
              <blockquote className="font-serif text-xl leading-snug text-charcoal md:text-2xl">
                &ldquo;{m.quote}&rdquo;
              </blockquote>
              <p className="mt-3 text-sm text-warm-grey">{m.author}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Favourite things */}
      <div className="space-section-md border-t border-border-warm px-5 md:px-10">
        <div className="mx-auto max-w-xl">
          <h3 className="font-serif text-xl text-charcoal md:text-2xl">
            The things that made Margaret, Margaret.
          </h3>
          <ul className="mt-8 divide-y divide-border-warm">
            {favourites.map((item) => (
              <li key={item} className="py-4 font-serif text-lg text-charcoal md:text-xl">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Philosophy — closing of Margaret experience */}
      <div className="space-section-lg border-t border-border-warm px-5 text-center md:px-10">
        <h2 className="mx-auto max-w-2xl font-serif text-2xl leading-snug text-charcoal md:text-4xl">
          The technology should disappear. The person should remain.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-warm-grey">
          The QR code is only the bridge. The story is the product.
        </p>
      </div>

      {/* Story creation — small line only */}
      <div className="space-section-md border-t border-border-warm px-5 md:px-10">
        <div className="mx-auto max-w-xl">
          <h3 className="font-serif text-xl text-charcoal">
            Families bring the memories. LifeMarked helps shape the story.
          </h3>
          <p className="mt-4 text-warm-grey">
            Photographs, eulogies, recordings and memories can be brought together into
            one beautifully structured life story.
          </p>
        </div>
      </div>

      {onReturn && (
        <div className="px-5 pb-10 md:px-10">
          <button type="button" className="text-link" onClick={onReturn}>
            Return to the memorial
          </button>
        </div>
      )}
    </article>
  );
}
