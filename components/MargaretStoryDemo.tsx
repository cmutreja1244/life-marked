"use client";

import Image from "next/image";
import { useState } from "react";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { MemorialDemo } from "./MemorialDemo";

export function MargaretStoryDemo() {
  const [open, setOpen] = useState(false);

  const discover = () => {
    setOpen(true);
    trackEvent(ANALYTICS_EVENTS.demoOpened);
  };

  return (
    <section id="memorials" className="section-pad-md border-t border-border-warm">
      <div className="content-width grid items-center gap-8 md:grid-cols-[58%_42%] md:gap-12">
        <div className="relative aspect-[4/5] w-full overflow-hidden img-radius md:aspect-auto md:min-h-[520px] md:h-[560px]">
          <Image
            src="/images/margaret-memorial-close.webp"
            alt="Margaret Eleanor Campbell's memorial with a discreet LifeMarked marker"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 58vw"
          />
        </div>

        <div>
          <p className="section-label">Concept preview</p>
          <h2 className="mt-3 font-serif text-[2.25rem] leading-tight text-charcoal md:text-[3.25rem]">
            Meet Margaret.
          </h2>
          <p className="mt-4 text-lg text-warm-grey">
            A name on stone. A whole life behind it.
          </p>
          {!open && (
            <button type="button" className="btn-primary mt-8" onClick={discover}>
              Discover Margaret&apos;s story
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="mt-10">
          <MemorialDemo onReturn={() => setOpen(false)} />
        </div>
      )}
    </section>
  );
}
