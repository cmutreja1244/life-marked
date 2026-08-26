"use client";

import Image from "next/image";
import { useState } from "react";

const finishes = [
  {
    id: "steel",
    name: "Stone / Silver",
    description: "Brushed stainless steel.",
    image: "/images/finish-steel.webp",
  },
  {
    id: "heritage",
    name: "Heritage",
    description: "Muted brass or bronze.",
    image: "/images/finish-bronze.webp",
  },
  {
    id: "discreet",
    name: "Discreet",
    description: "Dark engraved finish.",
    image: "/images/finish-dark.webp",
  },
];

export function PhysicalProduct() {
  const [active, setActive] = useState("steel");
  const current = finishes.find((f) => f.id === active) ?? finishes[0];

  return (
    <section className="space-section-xl bg-deep-charcoal text-ivory">
      <div className="content-width mx-auto">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">
              Designed to belong.
            </h2>
            <p className="mt-5 max-w-sm text-ivory/65">
              A marker quiet enough to sit on a premium memorial — elegant enough
              to stay there permanently.
            </p>
            <p className="section-label mt-10 text-ivory/40">Concept finishes</p>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden md:aspect-[2/1]">
            <Image
              key={current.id}
              src={current.image}
              alt={`LifeMarked marker — ${current.name}`}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-6 border-t border-ivory/10 pt-8 md:gap-12">
          {finishes.map((finish) => (
            <button
              key={finish.id}
              type="button"
              onClick={() => setActive(finish.id)}
              className={`text-left transition-opacity ${active === finish.id ? "opacity-100" : "opacity-45 hover:opacity-70"}`}
            >
              <p className="font-serif text-lg">{finish.name}</p>
              <p className="mt-1 text-sm text-ivory/55">{finish.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-4 border-t border-ivory/10 pt-8">
          <div className="flex h-10 w-10 items-center justify-center border border-ivory/30 font-serif text-sm">
            LM
          </div>
          <p className="text-sm text-ivory/50">
            LifeMarked wordmark and monogram — concept mark, engravable at small scale.
          </p>
        </div>
      </div>
    </section>
  );
}
