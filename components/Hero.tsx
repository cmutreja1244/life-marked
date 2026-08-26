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

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? undefined : { scale: imageScale }}
      >
        <Image
          src="/images/hero-margaret-memorial.webp"
          alt="Margaret Eleanor Campbell's memorial stone in a peaceful British memorial garden at golden hour"
          fill
          priority
          className="object-cover object-[center_42%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/70 via-deep-charcoal/15 to-deep-charcoal/25" />
      </motion.div>

      <motion.div
        className="relative z-10 flex h-full flex-col justify-between px-5 pb-10 pt-24 md:px-12 md:pb-14 md:pt-28"
        style={
          reduceMotion
            ? undefined
            : { y: contentY, opacity: contentOpacity }
        }
      >
        <div className="mx-auto w-full max-w-[76rem] flex-1">
          <div className="ml-auto max-w-xl md:mr-[6%] md:max-w-2xl md:pt-[12vh]">
            <p className="section-label text-ivory/55">Margaret Eleanor Campbell · 1941 — 2025</p>
            <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.08] tracking-[-0.01em] text-ivory md:text-[3.75rem] lg:text-[4.25rem]">
              Every life leaves more than a name.
            </h1>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ivory/80 md:text-lg">
              LifeMarked connects a physical memorial to the photographs, voices
              and memories behind a life.
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[76rem] flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <a
            href="#story"
            className="btn-ghost-light"
            onClick={() => trackEvent(ANALYTICS_EVENTS.seeHowItWorks)}
          >
            See how it works
          </a>
          <a
            href="#contact"
            className="btn-primary bg-ivory/95 text-charcoal hover:bg-ivory"
            onClick={() => trackEvent(ANALYTICS_EVENTS.heroPartnerCta)}
          >
            Become a launch partner
          </a>
        </div>
      </motion.div>
    </section>
  );
}
