"use client";

import Image from "next/image";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

const benefits = [
  {
    title: "More value for families",
    description: "Offer something beyond the inscription.",
  },
  {
    title: "Additional revenue",
    description: "Add a premium service to an existing sale.",
  },
  {
    title: "No technology to manage",
    description: "LifeMarked handles setup and the digital experience.",
  },
];

const workflow = [
  {
    step: "1",
    title: "Offer LifeMarked",
    description: "Introduce it alongside the memorial.",
  },
  {
    step: "2",
    title: "We handle the experience",
    description: "LifeMarked supplies the marker and guides the family.",
  },
  {
    step: "3",
    title: "You earn from every sale",
    description: "Simple.",
  },
];

export function Partners() {
  return (
    <section id="partners" className="space-section-xl bg-deep-charcoal text-ivory">
      <div className="content-width mx-auto">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="section-label text-ivory/45">For memorial businesses</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight md:text-[2.75rem]">
              A premium add-on for the memorials you already sell.
            </h2>
            <p className="mt-6 max-w-md text-ivory/70">
              Offer families a LifeMarked digital memorial alongside the headstone,
              plaque or bench they are already purchasing. LifeMarked handles the
              digital experience. You introduce it.
            </p>

            <div className="mt-12 space-y-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="border-t border-ivory/10 pt-6">
                  <h3 className="font-serif text-xl">{benefit.title}</h3>
                  <p className="mt-2 text-ivory/60">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/partner-showroom.webp"
                alt="LifeMarked sample plaque and brochure displayed beside memorial stone samples in a showroom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p className="section-label mt-4 text-ivory/40">Partner concept</p>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-ivory/10 pt-16 md:grid-cols-3 md:gap-12">
          {workflow.map((item) => (
            <div key={item.step}>
              <span className="font-serif text-3xl text-bronze/80">{item.step}</span>
              <h3 className="mt-4 font-serif text-xl">{item.title}</h3>
              <p className="mt-2 text-ivory/60">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-xl border-t border-ivory/10 pt-10">
          <p className="text-ivory/80">
            We&apos;re speaking with a small number of UK memorial businesses about
            an initial pilot.
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
