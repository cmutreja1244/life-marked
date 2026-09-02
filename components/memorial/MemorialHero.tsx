import Image from "next/image";
import type { Memorial } from "@/data/memorials/types";

export function MemorialHero({ memorial }: { memorial: Memorial }) {
  return (
    <section className="bg-ivory">
      <div className="mx-auto grid max-w-[76rem] items-center gap-8 px-5 py-8 md:grid-cols-[52%_48%] md:gap-12 md:px-10 md:py-12">
        <div className="order-2 md:order-1">
          <div className="relative aspect-[4/5] max-h-[52vh] w-full overflow-hidden img-radius md:max-h-none md:h-[640px] md:aspect-auto">
            <Image
              src={memorial.heroImage}
              alt={memorial.heroImageAlt}
              fill
              priority
              loading="eager"
              className="object-cover object-[center_18%]"
              sizes="(max-width: 768px) 100vw, 52vw"
            />
          </div>
        </div>

        <div className="order-1 md:order-2 md:pr-6">
          <p className="section-label">LifeMarked demo memorial</p>
          <h1 className="mt-3 font-serif text-[2.15rem] leading-[1.08] tracking-tight text-charcoal md:text-[3.75rem]">
            {memorial.fullName}
          </h1>
          <p className="mt-3 text-[0.95rem] tracking-wide text-warm-grey">{memorial.years}</p>
          <h2 className="mt-6 font-serif text-[1.45rem] leading-snug text-charcoal md:text-[1.85rem]">
            {memorial.openingLine}
          </h2>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-warm-grey">
            {memorial.intro}
          </p>
          <a
            href="#her-story"
            className="mt-8 inline-block text-sm text-warm-grey hover:text-charcoal"
          >
            Her story ↓
          </a>
        </div>
      </div>
    </section>
  );
}
