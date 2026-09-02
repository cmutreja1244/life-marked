"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Does the partner need any software?",
    answer:
      "No. The pilot is deliberately standalone. No CRM, POS or funeral-management integration is required.",
  },
  {
    question: "Is there a monthly subscription?",
    answer:
      "No partner subscription is planned. The current customer model is a one-time LifeMarked purchase.",
  },
  {
    question: "Who creates the memorial?",
    answer:
      "LifeMarked handles the digital memorial creation and works directly with the family to gather the relevant content.",
  },
  {
    question: "Who installs the marker?",
    answer:
      "LifeMarked is responsible for creating the marker with the QR code. It can then either be sent directly to the family so they can attach it in the relevant place, or sent to the partner to fit — for example to a bench or stone. The arrangement can be agreed during the pilot.",
  },
  {
    question: "What happens if a family wants to update the memorial?",
    answer:
      "The family will have access to a self-service portal to maintain, manage and update the memorial details. LifeMarked is there to help and support as required.",
  },
  {
    question: "Are the prices final?",
    answer:
      "The £179 and £249 prices are the current pilot pricing model and may be refined with launch-partner feedback before wider rollout.",
  },
  {
    question: "Can LifeMarked be fitted to any memorial?",
    answer:
      "Rules vary between cemeteries, churchyards, burial grounds and memorial parks. LifeMarked is designed to work with experienced memorial businesses so each installation can follow the relevant local requirements.",
  },
];

export function PilotFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-ivory">
      <div className="content-width py-12 md:py-20">
        <h2 className="font-serif text-[2rem] leading-tight text-charcoal md:text-[2.75rem]">
          Questions partners usually ask
        </h2>

        <div className="mt-8 divide-y divide-border-warm border-y border-border-warm">
          {faqs.map((item, index) => {
            const open = openIndex === index;
            const panelId = `pilot-faq-${index}`;

            return (
              <div key={item.question} className="pilot-avoid-break">
                <h3>
                  <button
                    type="button"
                    className="flex w-full min-h-12 items-center justify-between gap-6 py-4 text-left text-[1.05rem] text-charcoal hover:text-bronze focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="text-bronze">
                      {open ? "–" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  className={open ? "pb-5" : "hidden print:block print:pb-5"}
                >
                  <p className="max-w-3xl text-[1.05rem] leading-relaxed text-warm-grey">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
