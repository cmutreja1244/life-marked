"use client";

import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

export function FinalCTA() {
  return (
    <section className="space-section-xl bg-ivory text-center">
      <div className="content-width mx-auto px-5 md:px-10">
        <h2 className="mx-auto max-w-3xl font-serif text-3xl leading-tight text-charcoal md:text-5xl">
          Their name deserves to be remembered.
        </h2>
        <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl leading-tight text-charcoal md:text-5xl">
          Their story deserves to be known.
        </h2>
        <a
          href="#contact"
          className="btn-primary mt-14 inline-flex"
          onClick={() => trackEvent(ANALYTICS_EVENTS.finalCtaClicked)}
        >
          Become a launch partner
        </a>
      </div>
    </section>
  );
}
