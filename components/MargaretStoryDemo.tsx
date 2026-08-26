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
      window.setTimeout(() => setPhase("story"), 1200);
    }
  };

  const openStory = () => {
    setPhase("story");
    trackEvent(ANALYTICS_EVENTS.demoOpened);
  };

  return (
    <section id="memorials" className="relative bg-ivory">
      <AnimatePresence mode="wait">
        {phase !== "story" ? (
          <motion.div key="physical" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <div className="space-section-md border-t border-border-warm">
              <div className="content-width mx-auto mb-10 max-w-xl">
                <p className="section-label">Concept preview</p>
                <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-5xl">Meet Margaret.</h2>
                <p className="mt-4 text-lg text-warm-grey">
                  A name on stone. A whole life behind it.
                </p>
              </div>
            </div>

            <div className="relative min-h-[65vh] md:min-h-[78vh]">
              <Image
                src="/images/margaret-memorial-close.webp"
                alt="Margaret Eleanor Campbell's memorial with a discreet LifeMarked marker"
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/75 via-transparent to-transparent" />

              {phase === "scan" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-[28%] right-[18%] h-12 w-12 border border-ivory/70 md:bottom-[30%] md:right-[22%] md:h-14 md:w-14"
                  aria-hidden
                />
              )}

              <div className="absolute inset-x-0 bottom-0 space-section-md">
                <div className="content-width mx-auto">
                  {phase === "memorial" && (
                    <div className="flex flex-col items-start gap-4">
                      <button
                        type="button"
                        className="btn-primary bg-ivory text-charcoal hover:bg-ivory/90"
                        onClick={discover}
                      >
                        Discover Margaret&apos;s story
                      </button>
                      {reduceMotion && (
                        <button
                          type="button"
                          className="btn-primary bg-ivory text-charcoal hover:bg-ivory/90"
                          onClick={openStory}
                        >
                          Discover Margaret&apos;s story
                        </button>
                      )}
                    </div>
                  )}
                  {phase === "scan" && !reduceMotion && (
                    <p className="text-ivory/80">Opening Margaret&apos;s story…</p>
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
            transition={{ duration: 0.7 }}
            className="mx-auto w-full max-w-[85vw] md:max-w-[min(85vw,72rem)]"
          >
            <MemorialDemo onReturn={() => setPhase("memorial")} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
