import Image from "next/image";
import type { Memorial } from "@/data/memorials/types";

export function LifeStory({ memorial }: { memorial: Memorial }) {
  const [first, ...rest] = memorial.biography;
  const [wedding, garden] = memorial.storyImages;
  const mid = Math.ceil(rest.length / 2);
  const beforeQuote = rest.slice(0, mid);
  const afterQuote = rest.slice(mid);

  const copy = (
    <>
      {beforeQuote.map((paragraph) => (
        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
      ))}

      <blockquote className="border-l border-bronze/40 py-1 pl-5 font-serif text-[1.45rem] leading-snug text-charcoal md:text-[1.7rem]">
        {memorial.pullQuote}
      </blockquote>

      {afterQuote.map((paragraph) => (
        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
      ))}

      {garden && (
        <figure className="pt-2">
          <div className="relative aspect-[4/3] overflow-hidden img-radius">
            <Image
              src={garden.src}
              alt={garden.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
            />
          </div>
          <figcaption className="mt-2 text-sm text-warm-grey">{garden.caption}</figcaption>
        </figure>
      )}
    </>
  );

  const weddingFigure = wedding ? (
    <figure>
      <div className="relative aspect-[3/4] overflow-hidden img-radius">
        <Image
          src={wedding.src}
          alt={wedding.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 28rem, 352px"
        />
      </div>
      <figcaption className="mt-2 text-sm text-warm-grey">{wedding.caption}</figcaption>
    </figure>
  ) : null;

  return (
    <section id="her-story" className="bg-ivory">
      <div className="mx-auto max-w-[76rem] px-5 py-12 md:px-10 md:py-20">
        <div className="mx-auto max-w-[40rem] lg:max-w-[58rem] xl:max-w-[66rem]">
          <h2 className="font-serif text-[2rem] text-charcoal md:text-[2.75rem]">Her story</h2>

          <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start lg:gap-x-12 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-x-14">
            <p className="text-[1.0625rem] leading-[1.75] text-charcoal lg:hidden">{first}</p>

            {weddingFigure && (
              <div className="mt-8 max-w-md lg:col-start-2 lg:row-start-1 lg:mt-1 lg:max-w-none">
                {weddingFigure}
              </div>
            )}

            <div className="mt-8 space-y-6 text-[1.0625rem] leading-[1.75] text-charcoal lg:col-start-1 lg:row-start-1 lg:mt-0">
              <p className="hidden lg:block">{first}</p>
              {copy}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
