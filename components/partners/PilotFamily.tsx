import Image from "next/image";
import Link from "next/link";
import { MARGARET_HREF } from "@/lib/pilot";

const familyReceives = [
  "A discreet engraved LifeMarked marker",
  "A beautifully designed hosted memorial",
  "Biography and life story",
  "Photographs",
  "Milestones and timeline",
  "Memories and tributes",
  "Voice recordings, where included",
  "Video, where included",
  "Family-led content",
];

export function PilotFamily() {
  return (
    <>
      <section className="bg-stone">
        <div className="content-width grid items-start gap-10 py-12 md:grid-cols-[1fr_0.9fr] md:gap-16 md:py-20">
          <div>
            <h2 className="font-serif text-[2rem] leading-tight text-charcoal md:text-[2.75rem]">
              What the family receives
            </h2>
            <p className="mt-4 max-w-xl text-[1.1rem] leading-relaxed text-warm-grey">
              LifeMarked gives the family a place to preserve the parts of a life that
              could never fit onto stone.
            </p>
            <ul className="mt-8 space-y-3 text-[1.05rem] text-charcoal">
              {familyReceives.map((item) => (
                <li key={item} className="border-l border-bronze/40 pl-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <figure className="md:pt-4">
            <div className="mx-auto w-full max-w-[260px] rounded-[1.85rem] border border-charcoal/15 bg-charcoal p-2">
              <div className="relative aspect-[390/844] overflow-hidden rounded-[1.35rem] bg-ivory">
                <Image
                  src="/images/partner/margaret-preview.webp"
                  alt="Preview of a LifeMarked memorial on a smartphone"
                  fill
                  className="object-cover object-top"
                  sizes="260px"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-center text-sm text-warm-grey">
              Opened with a normal smartphone camera. No app required.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="content-width py-12 md:py-20">
          <p className="section-label">Example memorial</p>
          <h2 className="mt-3 max-w-3xl font-serif text-[2rem] leading-tight text-charcoal md:text-[2.75rem]">
            See what the customer actually receives.
          </h2>
          <p className="mt-4 max-w-xl text-[1.1rem] leading-relaxed text-warm-grey">
            The best way to understand LifeMarked is to experience one.
          </p>

          <div className="mt-10 grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
            <Link
              href={MARGARET_HREF}
              aria-label="View Margaret’s memorial"
              className="group relative block overflow-hidden img-radius"
            >
              <div className="relative aspect-[4/5] md:aspect-[5/4]">
                <Image
                  src="/images/margaret/portrait.webp"
                  alt="Portrait of Margaret Eleanor Campbell"
                  fill
                  className="object-cover object-[center_18%] transition-opacity duration-300 group-hover:opacity-95"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
              </div>
            </Link>

            <div>
              <p className="section-label text-bronze">LifeMarked demonstration</p>
              <h3 className="mt-3 font-serif text-[1.85rem] leading-tight text-charcoal md:text-[2.25rem]">
                Margaret Eleanor Campbell
              </h3>
              <p className="mt-2 text-warm-grey">1941 — 2025</p>
              <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-warm-grey">
                A finished memorial with biography, photographs, milestones, memories
                and a concept voice recording — representative of what a family
                receives.
              </p>
              <Link href={MARGARET_HREF} className="btn-primary mt-8">
                View Margaret’s memorial
              </Link>
              <p className="mt-4 text-sm text-warm-grey">
                Margaret is a fictional LifeMarked demonstration memorial.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
