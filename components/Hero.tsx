"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const phoneOpacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const phoneY = useTransform(scrollYProgress, [0, 0.45], [40, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.15, 0.35]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-[88vh] overflow-hidden md:min-h-[92vh]"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hero-memorial.png"
          alt="An elegant contemporary memorial stone in a peaceful British landscape with a discreet engraved marker"
          fill
          priority
          className="object-cover object-[center_35%]"
          sizes="100vw"
        />
        <motion.div
          className="absolute inset-0 bg-deep-charcoal"
          style={{ opacity: reduceMotion ? 0.25 : overlayOpacity }}
        />
      </div>

      <div className="relative z-10 flex min-h-[88vh] flex-col justify-end md:min-h-[92vh]">
        <div className="content-width mx-auto w-full px-5 pb-16 pt-32 md:px-10 md:pb-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.5fr] lg:items-end">
            <div className="max-w-2xl">
              <h1 className="font-serif text-[2.35rem] leading-[1.12] tracking-tight text-ivory md:text-5xl lg:text-[3.35rem]">
                Every life leaves more than a name.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/88 md:text-lg">
                LifeMarked connects a physical memorial to the story behind it —
                photographs, memories, video, voice and the moments that made
                someone who they were.
              </p>
              <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <a
                  href="#contact"
                  className="btn-primary bg-ivory text-charcoal hover:bg-ivory/90"
                  onClick={() => trackEvent(ANALYTICS_EVENTS.heroPartnerCta)}
                >
                  Become a launch partner
                </a>
                <a
                  href="#how-it-works"
                  className="text-link text-ivory decoration-ivory/40 hover:decoration-ivory"
                  onClick={() => trackEvent(ANALYTICS_EVENTS.seeHowItWorks)}
                >
                  See how it works
                </a>
              </div>
            </div>

            {!reduceMotion && (
              <motion.div
                className="hidden justify-end lg:flex"
                style={{ opacity: phoneOpacity, y: phoneY }}
              >
                <div className="relative h-[420px] w-[220px] overflow-hidden editorial-border bg-deep-charcoal/40 shadow-2xl">
                  <Image
                    src="/images/phone-profile.png"
                    alt="A phone displaying Margaret Campbell's memorial story"
                    fill
                    className="object-cover object-top"
                    sizes="220px"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
