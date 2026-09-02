import { ContactForm } from "@/components/ContactForm";
import { COMPANY } from "@/lib/company";
import { SITE_URL } from "@/lib/pilot";

export function PilotCta() {
  return (
    <section id="discuss-pilot" className="bg-stone">
      <div className="content-width py-12 md:py-20">
        <div className="grid items-start gap-10 md:grid-cols-[38%_62%] md:gap-14">
          <div>
            <h2 className="font-serif text-[2rem] leading-tight text-charcoal md:text-[2.75rem]">
              Interested in becoming a launch partner?
            </h2>
            <p className="mt-5 text-[1.1rem] leading-relaxed text-warm-grey">
              If LifeMarked feels like something that could sit naturally alongside the
              memorials you already offer, we’d be happy to talk through the pilot and how
              it could work for your business.
            </p>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-charcoal">
              <a href={`mailto:${COMPANY.supportEmail}`} className="text-link">
                {COMPANY.supportEmail}
              </a>
            </p>
            <p className="mt-2">
              <a href={SITE_URL} className="text-link">
                lifemarked.co.uk
              </a>
            </p>
            <p className="mt-5 text-sm text-warm-grey">
              Based in Edinburgh, working with launch partners across the UK.
            </p>
          </div>

          <div className="pilot-print-hide">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
