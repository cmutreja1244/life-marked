import Image from "next/image";
import Link from "next/link";
import { MARGARET_HREF } from "@/lib/pilot";

export function PilotHero() {
  return (
    <section className="bg-ivory">
      <div className="content-width py-12 md:py-16">
        <p className="section-label text-bronze">For memorial partners</p>
        <h1 className="mt-4 max-w-3xl font-serif text-[2.15rem] leading-[1.08] tracking-tight text-charcoal md:text-[3.25rem]">
          A premium add-on for the memorials you already sell.
        </h1>
        <p className="mt-6 max-w-2xl text-[1.1rem] leading-relaxed text-warm-grey md:text-[1.2rem]">
          LifeMarked connects a physical memorial to a beautifully designed digital
          life story — giving families a richer way to remember someone, while creating
          a new revenue stream for the memorial business.
        </p>
        <p className="mt-4 max-w-2xl text-[1.05rem] text-charcoal">
          No setup fee. No software to manage. No subscription for the partner.
        </p>
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link href={MARGARET_HREF} className="btn-primary">
            View example memorial
          </Link>
          <a href="#discuss-pilot" className="text-link pilot-print-hide">
            Discuss the pilot
          </a>
        </div>
        <p className="mt-8 max-w-xl font-serif text-xl leading-snug text-charcoal md:text-[1.45rem]">
          The QR code is only the bridge. The story is the product.
        </p>

        <div className="mt-12 grid items-end gap-6 md:grid-cols-3 md:gap-8">
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden img-radius">
              <Image
                src="/images/bench-memorial.webp"
                alt="Memorial bench in a quiet garden"
                fill
                priority
                loading="eager"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <figcaption className="mt-3 text-sm text-warm-grey">
              The physical memorial
            </figcaption>
          </figure>

          <figure>
            <div className="relative aspect-[4/5] overflow-hidden img-radius">
              <Image
                src="/images/plaque-product.webp"
                alt="Discreet brushed-metal LifeMarked marker"
                fill
                priority
                loading="eager"
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <figcaption className="mt-3 text-sm text-warm-grey">
              A discreet LifeMarked marker
            </figcaption>
          </figure>

          <figure>
            <div className="mx-auto w-full max-w-[220px] rounded-[1.85rem] border border-charcoal/15 bg-charcoal p-2">
              <div className="relative aspect-[390/844] overflow-hidden rounded-[1.35rem] bg-ivory">
                <Image
                  src="/images/partner/margaret-preview.webp"
                  alt="Margaret Campbell LifeMarked memorial on a phone"
                  fill
                  priority
                  loading="eager"
                  className="object-cover object-top"
                  sizes="220px"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-center text-sm text-warm-grey">
              The digital memorial, opened on a phone
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
