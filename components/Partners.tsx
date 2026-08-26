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
    <section id="partners" className="space-section-xl bg-deep-charcoal text-ivory">
      <div className="content-width mx-auto">
        <p className="section-label text-ivory/45">For memorial businesses</p>
        <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight md:text-[2.65rem]">
          A premium add-on for the memorials you already sell.
        </h2>
        <p className="mt-6 max-w-xl text-ivory/75">
          Offer families a LifeMarked digital memorial alongside the headstone, plaque or
          bench they are already purchasing. We handle the digital experience. You introduce
          it.
        </p>

        <div className="mt-12 space-y-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="max-w-md border-t border-ivory/10 pt-6">
              <h3 className="font-serif text-xl">{benefit.title}</h3>
              <p className="mt-2 text-ivory/60">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-ivory/10 pt-12">
          <p className="text-center font-serif text-lg text-ivory/90 md:text-xl">
            You offer it → We handle it → You earn from it
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 text-center text-sm text-ivory/55 md:flex-row md:gap-12">
            <span>Offer LifeMarked</span>
            <span className="hidden md:inline" aria-hidden>·</span>
            <span>LifeMarked handles fulfilment</span>
            <span className="hidden md:inline" aria-hidden>·</span>
            <span>Earn from every sale</span>
          </div>
        </div>

        <div className="mt-16">
          <div className="relative aspect-[4/3] max-w-2xl">
            <Image
              src="/images/partner-display.webp"
              alt="Memorial showroom display with LifeMarked plaque sample and information card"
              fill
              className="object-cover"
              sizes="672px"
            />
          </div>
          <p className="section-label mt-4 text-ivory/40">Partner display concept</p>
        </div>

        <div className="mt-16 max-w-xl border-t border-ivory/10 pt-10">
          <p className="text-ivory/80">
            We&apos;re inviting a small number of UK memorial businesses to help shape the
            first LifeMarked pilot.
          </p>
          <a
            href="#contact"
            className="btn-primary mt-8 inline-flex bg-ivory text-charcoal hover:bg-ivory/90"
            onClick={() => trackEvent(ANALYTICS_EVENTS.partnerSectionCta)}
          >
            Become a launch partner
          </a>
        </div>
      </div>
    </section>
  );
}
