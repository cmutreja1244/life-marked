"use client";

import Image from "next/image";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

export function Hero() {
  return (
    <section id="top" className="bg-ivory pt-16 md:pt-[72px]">
      <div className="content-width grid items-center gap-8 py-8 md:grid-cols-[0.85fr_1.15fr] md:gap-14 md:py-10">
        <div>
          <h1 className="max-w-[520px] font-serif text-[2.4rem] leading-[1.08] tracking-tight text-charcoal md:text-[4.5rem]">
            Every life leaves more than a name.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-warm-grey">
            Life Marked connects a physical memorial to the photographs, voices and
            memories behind a life.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="btn-primary"
              onClick={() => trackEvent(ANALYTICS_EVENTS.heroPartnerCta)}
            >
              Become a partner
            </a>
            <a
              href="#how-it-works"
              className="text-link"
              onClick={() => trackEvent(ANALYTICS_EVENTS.seeHowItWorks)}
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full max-h-[720px] overflow-hidden img-radius md:aspect-auto md:h-[720px]">
          <Image
            src="/images/hero-margaret-memorial.webp"
            alt="Memorial stone for Margaret Eleanor Campbell, 1941–2025, with a discreet Life Marked marker"
            fill
            priority
            className="object-cover object-[center_38%]"
            sizes="(max-width: 768px) 100vw, 58vw"
          />
        </div>
      </div>
    </section>
  );
}
