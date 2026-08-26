"use client";

import Image from "next/image";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#1a1917]">
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/images/margaret/portrait.webp"
          alt=""
          fill
          className="object-cover object-[center_20%] grayscale"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1917] via-[#1a1917]/90 to-[#1a1917]/70" />

      <div className="relative space-section-xl text-center">
        <div className="content-width mx-auto px-5 md:px-10">
          <h2 className="mx-auto max-w-3xl font-serif text-[2rem] leading-[1.15] text-ivory md:text-5xl lg:text-[3.25rem]">
            Their name deserves to be remembered.
            <br />
            Their story deserves to be known.
          </h2>
          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <a
              href="#contact"
              className="btn-primary bg-ivory text-charcoal hover:bg-ivory/90"
              onClick={() => trackEvent(ANALYTICS_EVENTS.finalCtaClicked)}
            >
              Become a launch partner
            </a>
            <a href="#contact" className="btn-ghost-light">
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
