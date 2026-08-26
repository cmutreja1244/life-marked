"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { MemorialDemo } from "./MemorialDemo";

type Phase = "memorial" | "scan" | "story";

export function MargaretStoryDemo() {
  const [phase, setPhase] = useState<Phase>("memorial");
  const reduceMotion = useReducedMotion();

  const discover = () => {
    setPhase("scan");
    trackEvent(ANALYTICS_EVENTS.demoOpened);
    if (!reduceMotion) {
      window.setTimeout(() => setPhase("story"), 1400);
    }
  };

  const openStory = () => {
    setPhase("story");
    trackEvent(ANALYTICS_EVENTS.demoOpened);
  };

  return (
    <section id="memorials" className="relative">
      <AnimatePresence mode="wait">
        {phase !== "story" ? (
          <motion.div
            key="physical"
            initial={false}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative min-h-[70vh] md:min-h-[85vh]">
              <Image
                src="/images/margaret-memorial-close.webp"
                alt="Margaret Campbell's memorial with a discreet LifeMarked marker at the base"
                fill
                className="object-cover object-[center_55%]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/80 via-deep-charcoal/20 to-transparent" />

              {phase === "scan" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-[22%] left-[38%] h-14 w-14 md:bottom-[24%] md:left-[42%] md:h-16 md:w-16"
                  aria-hidden
                >
                  <div className="absolute inset-0 rounded-sm border border-ivory/60 bg-ivory/10 ring-[6px] ring-ivory/20 backdrop-blur-sm" />
                  <div className="absolute -inset-4 animate-pulse rounded-sm border border-bronze/40" />
                </motion.div>
              )}

              <div className="absolute inset-x-0 bottom-0 space-section-md">
                <div className="content-width mx-auto">
                  <p className="section-label text-ivory/50">Concept preview</p>
                  <h2 className="mt-3 max-w-lg font-serif text-3xl leading-tight text-ivory md:text-5xl">
                    A memorial can tell a story.
                  </h2>

                  {phase === "memorial" && (
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
                    >
                      <button
                        type="button"
                        className="btn-primary bg-ivory text-charcoal hover:bg-ivory/90"
                        onClick={discover}
                      >
                        Discover Margaret
                      </button>
                      {reduceMotion && (
                        <button type="button" className="btn-ghost-light" onClick={openStory}>
                          Explore her story
                        </button>
                      )}
                    </motion.div>
                  )}

                  {phase === "scan" && !reduceMotion && (
                    <p className="mt-8 text-ivory/70">Opening Margaret&apos;s story…</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="digital"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <MemorialDemo />
            <div className="space-section-lg bg-ivory text-center">
              <blockquote className="mx-auto max-w-3xl px-5 font-serif text-2xl leading-snug text-charcoal md:text-4xl md:leading-tight">
                The technology should disappear.
                <br className="hidden md:block" /> The person should remain.
              </blockquote>
              <p className="reading-width mx-auto mt-6 text-warm-grey">
                The marker is simply the bridge. LifeMarked is designed around
                the story it reveals.
              </p>
              <button
                type="button"
                className="text-link mt-10"
                onClick={() => setPhase("memorial")}
              >
                Return to the memorial
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
