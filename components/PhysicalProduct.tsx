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
    <section className="bg-stone">
      <div className="content-width section-pad-md">
        <div className="grid items-center gap-8 md:grid-cols-[58%_42%] md:gap-12">
          <div className="order-2 relative aspect-[16/10] w-full overflow-hidden img-radius md:order-1 md:aspect-auto md:h-[480px]">
            <Image
              key={current.id}
              src={current.image}
              alt={`LifeMarked marker — ${current.label}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="font-serif text-[2rem] leading-tight text-charcoal md:text-[3.25rem]">
              Designed to belong.
            </h2>
            <p className="mt-4 text-lg text-warm-grey">
              A LifeMarked marker should feel part of the memorial, not something added afterwards.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {finishes.map((finish) => (
                <button
                  key={finish.id}
                  type="button"
                  onClick={() => setActive(finish.id)}
                  className={`text-left text-sm ${
                    active === finish.id
                      ? "text-charcoal underline decoration-bronze underline-offset-4"
                      : "text-warm-grey"
                  }`}
                >
                  {finish.label}
                </button>
              ))}
            </div>
            <p className="section-label mt-5">Concept finishes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
