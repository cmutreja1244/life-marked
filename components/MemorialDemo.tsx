"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

const timeline = [
  { year: "1941", event: "Born in Edinburgh." },
  { year: "1963", event: "Married James after meeting him at a dance in Portobello." },
  { year: "1968", event: "Their first home — and eventually three children." },
  { year: "1985", event: "Opened Campbell Florists." },
  { year: "1999", event: "Became \"Gran\"." },
  { year: "2012", event: "Finally made it to Florence." },
  { year: "2025", event: "A life remembered by three generations." },
];

const memories = [
  "Gran never let anyone leave her house hungry.",
  "She knew every flower by its Latin name — and its favourite spot in the sun.",
  "Sunday afternoons meant Ella on the gramophone and letters to her sister in Glasgow.",
];

const favourites = [
  "Sunday roast",
  "Ella Fitzgerald",
  "Gardening",
  "Florence",
  "Handwritten letters",
];

const waveformHeights = [12, 24, 18, 32, 28, 14, 36, 22, 30, 16, 26, 20, 34, 18, 28, 12, 24, 30, 16, 22];

function Waveform() {
  return (
    <div className="flex h-10 items-end gap-[3px]" aria-hidden>
      {waveformHeights.map((h, i) => (
        <div key={i} className="waveform-bar" style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}

export function MemorialDemo() {
  const reduceMotion = useReducedMotion();

  return (
    <article
      className="bg-memorial-cream"
      aria-label="Margaret Eleanor Campbell — LifeMarked concept preview"
    >
      {/* Opening spread */}
      <div className="relative min-h-[72vh] md:min-h-[88vh]">
        <Image
          src="/images/margaret/portrait.webp"
          alt=""
          fill
          className="object-cover object-[center_15%]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/85 via-deep-charcoal/25 to-deep-charcoal/10" />
        <div className="absolute inset-x-0 bottom-0 space-section-md">
          <div className="content-width mx-auto">
            <p className="section-label text-ivory/50">Concept preview</p>
            <h1 className="mt-3 font-serif text-4xl text-ivory md:text-6xl lg:text-7xl">
              Margaret Eleanor Campbell
            </h1>
            <p className="mt-3 text-lg text-ivory/75 md:text-xl">1941 — 2025</p>
            <p className="mt-6 max-w-xl font-serif text-2xl leading-snug text-ivory md:text-3xl">
              Margaret made every room feel warmer.
            </p>
          </div>
        </div>
      </div>

      {/* Biography — editorial spread */}
      <div className="space-section-lg">
        <div className="content-width mx-auto grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[520px]"
          >
            <Image
              src="/images/margaret/wedding.webp"
              alt="Margaret and James, 1963"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <p className="absolute bottom-4 left-4 text-xs tracking-wide text-ivory/80">
              Margaret &amp; James, Portobello · 1963
            </p>
          </motion.div>

          <div className="flex flex-col justify-center">
            <p className="reading-width space-y-5 text-[1.05rem] leading-[1.75] text-warm-grey">
              <span className="block">
                Margaret was born in Edinburgh during the winter of 1941 — eldest
                of three sisters, calm and quietly determined from the start.
              </span>
              <span className="block">
                With James she built a home filled with flowers, music and long
                conversations. Campbell Florists, opened in 1985, became a gathering
                place as much as a shop.
              </span>
              <span className="block">
                She gardened whenever she was home, travelled when she could,
                and wrote letters the way other people breathe.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Full-bleed family moment */}
      <div className="relative aspect-[16/10] md:aspect-[21/9]">
        <Image
          src="/images/margaret/family-1.webp"
          alt="Margaret with her family in the garden"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <p className="absolute bottom-5 left-5 text-xs tracking-wide text-ivory/85 md:bottom-8 md:left-10">
          Summer in the garden · Edinburgh
        </p>
      </div>

      {/* Timeline */}
      <div className="space-section-lg">
        <div className="content-width mx-auto max-w-2xl">
          <hr className="editorial-rule mb-12" />
          <ol className="space-y-0">
            {timeline.map((item, i) => (
              <li
                key={item.year}
                className={`grid grid-cols-[5rem_1fr] gap-6 py-7 ${i > 0 ? "border-t border-border-warm" : ""}`}
              >
                <span className="font-serif text-xl text-bronze">{item.year}</span>
                <span className="text-[1.05rem] leading-relaxed text-charcoal">{item.event}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Audio moment */}
      <div className="space-section-md bg-ivory">
        <div className="content-width mx-auto grid gap-10 lg:grid-cols-[280px_1fr] lg:items-center">
          <div className="relative aspect-square max-w-[280px]">
            <Image
              src="/images/margaret/candid.webp"
              alt="Margaret in her garden, 1987"
              fill
              className="object-cover"
              sizes="280px"
            />
          </div>
          <div>
            <p className="section-label">Voice · concept preview</p>
            <p className="mt-3 font-serif text-2xl text-charcoal md:text-3xl">Margaret, 1987</p>
            <p className="mt-2 font-serif text-xl italic text-warm-grey">
              &ldquo;How I met James&rdquo;
            </p>
            <button
              type="button"
              className="mt-8 flex w-full max-w-lg items-center gap-5 border-t border-border-warm pt-8 text-left"
              onClick={() => trackEvent(ANALYTICS_EVENTS.demoAudioClicked)}
              aria-label="Play audio preview — concept only"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-charcoal text-lg text-charcoal">
                ▶
              </span>
              <div className="min-w-0 flex-1">
                <Waveform />
                <p className="mt-3 text-sm text-warm-grey">4:12 · Concept functionality</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Travel spread */}
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[480px]">
          <Image
            src="/images/margaret/travel.webp"
            alt="Margaret in Florence, 2012"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
        <div className="flex flex-col justify-center space-section-md bg-deep-charcoal text-ivory">
          <div className="content-width mx-auto max-w-md px-0 md:px-10">
            <p className="section-label text-ivory/45">Memories</p>
            <ul className="mt-8 space-y-8">
              {memories.map((memory) => (
                <li key={memory} className="font-serif text-xl leading-snug md:text-2xl">
                  &ldquo;{memory}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Favourite things */}
      <div className="space-section-xl text-center">
        <div className="content-width mx-auto">
          <p className="section-label">The things that made Margaret, Margaret.</p>
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-x-10 gap-y-4">
            {favourites.map((item) => (
              <li key={item} className="font-serif text-2xl text-charcoal md:text-3xl">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
