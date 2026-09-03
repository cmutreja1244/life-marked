import Image from "next/image";
import type { Memorial, SignificantPlace as Place } from "@/data/memorials/types";

export function SignificantPlace({ memorial, place }: { memorial?: Memorial; place?: Place }) {
  const items = place ? [place] : memorial?.places ?? [];
  if (!items.length) return null;

  return (
    <>
      {items.map((item, index) => (
        <section key={`${item.location}-${index}`} className="bg-ivory">
          <div className="mx-auto grid max-w-[76rem] items-center gap-8 px-5 py-12 md:grid-cols-2 md:gap-14 md:px-10 md:py-20">
            <figure className={index % 2 === 1 ? "md:order-2" : undefined}>
              {item.image ? (
                <div className="relative aspect-[16/10] overflow-hidden img-radius">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : null}
              {item.caption ? (
                <figcaption className="mt-2 text-sm text-warm-grey">{item.caption}</figcaption>
              ) : null}
            </figure>
            <div>
              <h2 className="font-serif text-[2rem] text-charcoal md:text-[2.75rem]">{item.heading}</h2>
              <p className="mt-3 font-serif text-xl text-bronze">{item.location}</p>
              <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-warm-grey">{item.text}</p>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
