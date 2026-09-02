import Image from "next/image";
import type { Memorial } from "@/data/memorials/types";

export function SignificantPlace({ memorial }: { memorial: Memorial }) {
  const place = memorial.places[0];
  if (!place) return null;

  return (
    <section className="bg-ivory">
      <div className="mx-auto grid max-w-[76rem] items-center gap-8 px-5 py-12 md:grid-cols-2 md:gap-14 md:px-10 md:py-20">
        <figure>
          <div className="relative aspect-[16/10] overflow-hidden img-radius">
            <Image
              src={place.image}
              alt={place.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <figcaption className="mt-2 text-sm text-warm-grey">{place.caption}</figcaption>
        </figure>
        <div>
          <h2 className="font-serif text-[2rem] text-charcoal md:text-[2.75rem]">{place.heading}</h2>
          <p className="mt-3 font-serif text-xl text-bronze">{place.location}</p>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-warm-grey">{place.text}</p>
        </div>
      </div>
    </section>
  );
}
