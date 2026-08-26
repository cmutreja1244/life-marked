"use client";

import Image from "next/image";
import { useState } from "react";

const finishes = [
  { id: "steel", label: "Brushed steel", image: "/images/plaque-product.webp" },
  { id: "bronze", label: "Aged bronze", image: "/images/finish-bronze.webp" },
  { id: "dark", label: "Dark engraved", image: "/images/finish-dark.webp" },
];

export function PhysicalProduct() {
  const [active, setActive] = useState("steel");
  const current = finishes.find((f) => f.id === active) ?? finishes[0];

  return (
    <section className="space-section-lg border-t border-border-warm">
      <div className="content-width mx-auto">
        <h2 className="font-serif text-3xl leading-tight text-charcoal md:text-[2.65rem]">
          Designed to belong.
        </h2>
        <p className="mt-5 max-w-lg text-warm-grey">
          A LifeMarked marker should feel part of the memorial, not something added afterwards.
        </p>

        <div className="relative mt-12 aspect-[16/10] max-h-[520px] w-full md:aspect-[2/1]">
          <Image
            key={current.id}
            src={current.image}
            alt={`LifeMarked marker — ${current.label}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 76rem"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-8 border-t border-border-warm pt-6">
          {finishes.map((finish) => (
            <button
              key={finish.id}
              type="button"
              onClick={() => setActive(finish.id)}
              className={`text-left text-sm transition-colors ${
                active === finish.id ? "text-charcoal" : "text-warm-grey hover:text-charcoal"
              }`}
            >
              {finish.label}
            </button>
          ))}
        </div>

        <p className="section-label mt-6">Concept finishes</p>
      </div>
    </section>
  );
}
