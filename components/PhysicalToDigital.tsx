"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { MemorialDemo } from "./MemorialDemo";

type Phase = "memorial" | "marker" | "story";

export function PhysicalToDigital() {
  const [phase, setPhase] = useState<Phase>("memorial");
  const reduceMotion = useReducedMotion();

  const openStory = () => {
    setPhase("story");
    trackEvent(ANALYTICS_EVENTS.demoOpened);
  };

  return (
    <section id="memorials" className="section-padding bg-ivory">
      <div className="content-width mx-auto">
        <div className="mb-12 max-w-xl">
          <p className="section-label">Concept preview</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-charcoal md:text-[2.65rem]">
            A memorial can tell a story.
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {phase !== "story" ? (
            <motion.div
              key="physical"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid gap-10 lg:grid-cols-2 lg:items-center"
            >
              <div className="relative aspect-[4/5] overflow-hidden editorial-border md:aspect-[5/6]">
                <Image
                  src="/images/plaque-closeup.png"
                  alt="Close view of a memorial with a discreet LifeMarked marker integrated into the stone"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {phase === "marker" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-[18%] right-[22%] h-8 w-8 rounded-sm border-2 border-bronze bg-bronze/20 ring-4 ring-bronze/30"
                    aria-hidden
                  />
                )}
              </div>

              <div className="flex flex-col gap-6">
                <p className="text-lg text-warm-grey">
                  {phase === "memorial"
                    ? "A physical memorial holds a name. LifeMarked connects it to everything that name cannot contain."
                    : "A discreet marker, integrated into the memorial — not added on afterwards."}
                </p>

                {phase === "memorial" ? (
                  <button
                    type="button"
                    className="btn-primary w-fit"
                    onClick={() => setPhase("marker")}
                  >
                    Show the marker
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary w-fit"
                    onClick={openStory}
                  >
                    Explore Margaret&apos;s story
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="digital"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MemorialDemo embedded />
              <button
                type="button"
                className="text-link mt-8"
                onClick={() => setPhase("memorial")}
              >
                Back to the memorial
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
