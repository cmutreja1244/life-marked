"use client";

import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

export function FinalCTA() {
  return (
    <section className="section-padding">
      <div className="content-width mx-auto text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-tight text-charcoal md:text-[2.75rem]">
          Their name deserves to be remembered.
          <br />
          Their story deserves to be known.
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <a
            href="#contact"
            className="btn-primary"
            onClick={() => trackEvent(ANALYTICS_EVENTS.finalCtaClicked)}
          >
            Become a launch partner
          </a>
          <a href="#contact" className="text-link">
            Talk to us
          </a>
        </div>
      </div>
    </section>
  );
}
