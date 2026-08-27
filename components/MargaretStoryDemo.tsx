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
    <section id="memorials" className="bg-deep-charcoal text-ivory">
      <div className="content-width section-pad-md">
        <div className="grid items-center gap-8 md:grid-cols-[60%_40%] md:gap-12">
          <div className="order-2 relative aspect-[4/5] w-full overflow-hidden img-radius md:order-1 md:aspect-auto md:h-[560px]">
            <Image
              src="/images/margaret-memorial-close.webp"
              alt="Margaret Eleanor Campbell's memorial with a discreet LifeMarked marker"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>

          <div className="order-1 md:order-2">
            <p className="section-label text-bronze">A memorial story</p>
            <h2 className="mt-3 font-serif text-[2.25rem] leading-tight text-ivory md:text-[3.5rem]">
              Meet Margaret.
            </h2>
            <p className="mt-4 text-lg text-ivory/70">
              A name on stone. A whole life behind it.
            </p>
            {!open && (
              <button type="button" className="btn-on-dark mt-8" onClick={discover}>
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

        <div className="mx-auto mt-14 max-w-3xl border-t border-ivory/10 pt-10 text-center md:mt-16">
          <h3 className="font-serif text-[1.85rem] leading-snug text-ivory md:text-[2.75rem]">
            The technology should disappear. The person should remain.
          </h3>
          <p className="mt-4 text-ivory/65">
            The QR code is only the bridge. The story is the product.
          </p>
        </div>
      </div>
    </section>
  );
}
