"use client";

import Image from "next/image";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

const benefits = [
  {
    title: "More value for families",
    description: "Offer something meaningful beyond the inscription.",
  },
  {
    title: "Additional revenue",
    description: "Add a premium service to an existing memorial sale.",
  },
  {
    title: "Nothing technical to manage",
    description: "LifeMarked handles the marker, setup and digital experience.",
  },
];

export function Partners() {
  return (
    <section id="partners" className="bg-deep-charcoal py-12 text-ivory md:py-24">
      <div className="content-width">
        <div className="grid items-start gap-10 md:grid-cols-[48%_52%] md:gap-12">
          <div>
            <p className="section-label text-ivory/45">For memorial businesses</p>
            <h2 className="mt-3 font-serif text-[2rem] leading-tight md:text-[2.75rem]">
              A premium add-on for the memorials you already sell.
            </h2>
            <p className="mt-4 text-ivory/75">
              Offer families a LifeMarked digital memorial alongside the headstone, plaque or
              bench they are already purchasing. We handle the digital experience. You introduce
              it.
            </p>
            <div className="mt-6">
              {benefits.map((benefit, i) => (
                <div
                  key={benefit.title}
                  className={`py-5 ${i > 0 ? "border-t border-ivory/12" : ""}`}
                >
                  <h3 className="font-serif text-lg">{benefit.title}</h3>
                  <p className="mt-1 text-sm text-ivory/60">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="relative aspect-[4/3] overflow-hidden img-radius">
              <Image
                src="/images/partner-display.webp"
                alt="Memorial showroom display with LifeMarked plaque sample and information card"
                fill
                className="object-cover"
                sizes="52vw"
              />
            </div>
            <p className="section-label mt-3 text-ivory/40">Partner display concept</p>
          </div>
        </div>

        <p className="mt-10 border-t border-ivory/12 pt-6 text-center font-serif text-lg text-ivory/90">
          You offer it → We handle it → You earn from it
        </p>
        <div className="mt-2 flex flex-col items-center justify-center gap-1 text-center text-sm text-ivory/50 md:flex-row md:gap-8">
          <span>Offer LifeMarked</span>
          <span>LifeMarked handles fulfilment</span>
          <span>Earn from every sale</span>
        </div>

        <div className="mt-8 text-center">
          <p className="mx-auto max-w-xl text-ivory/75">
            We&apos;re inviting a small number of UK memorial businesses to help shape the
            first LifeMarked pilot.
          </p>
          <a
            href="#contact"
            className="btn-primary mt-6 inline-flex bg-ivory text-charcoal hover:bg-ivory/90"
            onClick={() => trackEvent(ANALYTICS_EVENTS.partnerSectionCta)}
          >
            Become a launch partner
          </a>
        </div>
      </div>
    </section>
  );
}
