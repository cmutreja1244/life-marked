"use client";

import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { ContactForm } from "./ContactForm";

export function FinalCTA() {
  return (
    <>
      <section className="bg-ivory">
        <div className="content-width py-16 text-center md:py-[96px]">
          <h2 className="mx-auto max-w-[900px] font-serif text-[2.25rem] leading-none text-charcoal md:text-[4.25rem]">
            Their name deserves to be remembered.
            <br />
            Their story deserves to be known.
          </h2>
          <a
            href="#enquiry-form"
            className="btn-primary mt-8 inline-flex"
            onClick={() => trackEvent(ANALYTICS_EVENTS.finalCtaClicked)}
          >
            Become a partner
          </a>
        </div>
      </section>

      <section id="contact" className="bg-stone">
        <div id="enquiry-form" className="content-width py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-[35%_65%] md:gap-12">
            <div>
              <h2 className="font-serif text-[1.85rem] leading-tight text-charcoal md:text-[2.25rem]">
                Start a conversation.
              </h2>
              <p className="mt-4 text-warm-grey">
                If you sell memorials and would like to offer LifeMarked to your customers,
                we&apos;d love to hear from you.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
