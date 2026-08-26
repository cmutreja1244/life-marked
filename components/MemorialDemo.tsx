"use client";

import Image from "next/image";
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

const waveformHeights = [8, 18, 12, 28, 22, 10, 32, 16, 24, 14, 26, 18, 30, 12, 20, 28, 14, 22];

function Waveform() {
  return (
    <div className="flex h-7 items-end gap-[2px]" aria-hidden>
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
  return (
    <article
      className="mx-auto max-w-[1180px] bg-memorial-cream px-5 py-8 md:px-10 md:py-10"
      aria-label="Margaret Eleanor Campbell memorial concept preview"
    >
      <div className="grid gap-8 md:grid-cols-[40%_60%] md:items-start">
        <div className="relative aspect-[4/5] overflow-hidden img-radius">
          <Image
            src="/images/margaret/portrait.webp"
            alt="Portrait of Margaret Eleanor Campbell"
            fill
            className="object-cover object-[center_18%]"
            sizes="40vw"
          />
        </div>
        <div className="md:pt-2">
          <h3 className="font-serif text-3xl leading-tight text-charcoal md:text-4xl">
            Margaret Eleanor Campbell
          </h3>
          <p className="mt-1 text-warm-grey">1941 — 2025</p>
          <p className="mt-4 font-serif text-xl text-charcoal">
            Margaret made every room feel warmer.
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-warm-grey">
            Margaret was born in Edinburgh in 1941, the eldest of three sisters. She met James
            at a dance in Portobello and they made a home filled with music, flowers and
            conversation. Together they raised a family and, in 1985, opened Campbell Florists —
            a shop that became as much a meeting place as a business. Margaret gardened
            whenever she could, travelled to Florence in 2012, and became Gran to grandchildren
            who knew her kitchen as the warmest room in Edinburgh.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[55%_45%] md:items-start">
        <ol>
          {timeline.map((item, i) => (
            <li
              key={item.year}
              className={`grid grid-cols-[4rem_1fr] gap-4 py-3 text-[0.95rem] ${i > 0 ? "border-t border-border-warm" : ""}`}
            >
              <span className="font-serif text-bronze">{item.year}</span>
              <span className="text-charcoal">{item.event}</span>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative aspect-[3/4] overflow-hidden img-radius">
            <Image src="/images/margaret/wedding.webp" alt="Margaret and James, 1963" fill className="object-cover" sizes="200px" />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden img-radius">
            <Image src="/images/margaret/florist.webp" alt="Campbell Florists" fill className="object-cover" sizes="200px" />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[55%_45%] md:items-start">
        <div className="relative aspect-[16/10] overflow-hidden img-radius">
          <Image src="/images/margaret/travel.webp" alt="Margaret in Florence, 2012" fill className="object-cover" sizes="55vw" />
        </div>
        <div>
          <p className="section-label">Concept feature</p>
          <p className="mt-2 font-serif text-lg text-charcoal">Margaret, 1987</p>
          <p className="font-serif text-xl text-charcoal">How I met James</p>
          <button
            type="button"
            className="mt-4 flex w-full items-center gap-3 border-t border-border-warm pt-4 text-left"
            onClick={() => trackEvent(ANALYTICS_EVENTS.demoAudioClicked)}
            aria-label="Play audio preview — concept only"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-charcoal text-charcoal">
              ▶
            </span>
            <div className="min-w-0 flex-1">
              <Waveform />
              <p className="mt-1 text-sm text-warm-grey">2:14</p>
            </div>
          </button>
          <ul className="mt-6 space-y-4">
            {memories.map((m) => (
              <li key={m.quote}>
                <blockquote className="font-serif text-lg leading-snug text-charcoal">
                  &ldquo;{m.quote}&rdquo;
                </blockquote>
                <p className="mt-1 text-sm text-warm-grey">{m.author}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-border-warm pt-5">
        <p className="font-serif text-lg text-charcoal">The things that made Margaret, Margaret.</p>
        <p className="mt-3 text-warm-grey">
          {favourites.join("  ·  ")}
        </p>
      </div>

      <div className="mt-8 border-t border-border-warm pt-6">
        <h4 className="font-serif text-2xl leading-snug text-charcoal md:text-3xl">
          The technology should disappear. The person should remain.
        </h4>
        <p className="mt-3 text-warm-grey">
          The QR code is only the bridge. The story is the product.
        </p>
        <p className="mt-5 font-serif text-lg text-charcoal">
          Families bring the memories. LifeMarked helps shape the story.
        </p>
        <p className="mt-2 text-base text-warm-grey">
          Photographs, eulogies, recordings and memories can be brought together into
          one beautifully structured life story.
        </p>
        {onReturn && (
          <button type="button" className="text-link mt-5" onClick={onReturn}>
            Return to the memorial
          </button>
        )}
      </div>
    </article>
  );
}
