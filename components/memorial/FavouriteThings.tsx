import type { Memorial } from "@/data/memorials/types";

export function FavouriteThings({ memorial }: { memorial: Memorial }) {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-[40rem] px-5 py-12 text-center md:px-10 md:py-16">
        <h2 className="font-serif text-[1.85rem] leading-snug text-charcoal md:text-[2.35rem]">
          The things that made {memorial.firstName}, {memorial.firstName}.
        </h2>
        <p className="mt-6 text-[1.05rem] leading-relaxed text-warm-grey">
          {memorial.favouriteThings.join("  ·  ")}
        </p>
      </div>
    </section>
  );
}
