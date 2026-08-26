"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="top" className="relative min-h-[90vh] bg-ivory pt-14 md:pt-16">
      <div className="mx-auto grid min-h-[calc(90vh-3.5rem)] max-w-[76rem] md:grid-cols-[42%_58%]">
        <motion.div
          className="flex flex-col justify-center px-5 py-10 md:px-10 md:py-16 lg:px-12"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-[2.25rem] leading-[1.1] tracking-tight text-charcoal md:text-[2.75rem] lg:text-[3.25rem]">
            Every life leaves more than a name.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-warm-grey md:text-[1.05rem]">
            LifeMarked connects a physical memorial to the photographs, voices and
            memories behind a life.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="btn-primary"
              onClick={() => trackEvent(ANALYTICS_EVENTS.heroPartnerCta)}
            >
              Become a launch partner
            </a>
            <a
              href="#how-it-works"
              className="text-link"
              onClick={() => trackEvent(ANALYTICS_EVENTS.seeHowItWorks)}
            >
              See how it works
            </a>
          </div>
        </motion.div>

        <div className="relative min-h-[45vh] md:min-h-full md:-mr-[max(0px,calc((100vw-76rem)/2))]">
          <Image
            src="/images/hero-margaret-memorial.webp"
            alt="Memorial stone for Margaret Eleanor Campbell, 1941–2025, with a discreet LifeMarked marker"
            fill
            priority
            className="object-cover object-[center_40%]"
            sizes="(max-width: 768px) 100vw, 58vw"
          />
        </div>
      </div>
    </section>
  );
}
