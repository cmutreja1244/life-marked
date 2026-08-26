"use client";

import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

const benefits = [
  {
    title: "Additional revenue",
    description:
      "Offer LifeMarked as a premium add-on alongside existing memorial sales.",
  },
  {
    title: "No technical setup",
    description: "LifeMarked handles the digital experience.",
  },
  {
    title: "Meaningful differentiation",
    description: "Give families an option beyond the traditional inscription.",
  },
  {
    title: "Simple fulfilment",
    description:
      "The partner introduces LifeMarked. LifeMarked handles the customer experience.",
  },
];

export function Partners() {
  return (
    <section id="partners" className="section-padding bg-deep-charcoal text-ivory">
      <div className="content-width mx-auto">
        <p className="section-label text-ivory/50">For memorial businesses</p>
        <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight md:text-[2.65rem]">
          A new memorial service for your customers.
        </h2>
        <p className="mt-6 max-w-xl text-ivory/75">
          LifeMarked is designed to sit alongside the memorial products families
          already purchase. Partners can offer a premium digital memorial without
          needing to build, host or support the technology themselves.
        </p>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="border-t border-ivory/15 pt-6">
              <h3 className="font-serif text-xl text-ivory">{benefit.title}</h3>
              <p className="mt-3 text-ivory/70">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-2xl border-t border-ivory/15 pt-10">
          <p className="text-lg text-ivory/90">
            We&apos;re currently speaking with a small number of UK memorial
            businesses about an initial LifeMarked pilot.
          </p>
          <p className="mt-4 text-ivory/65">
            Help shape how LifeMarked works for memorial professionals and their
            customers.
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
