import type { Memorial } from "@/data/memorials/types";

export function MemorialClose({ memorial }: { memorial: Memorial }) {
  return (
    <section className="bg-stone">
      <div className="mx-auto max-w-[44rem] px-5 py-16 text-center md:px-10 md:py-24">
        <h2 className="font-serif text-[2.15rem] leading-tight text-charcoal md:text-[3.25rem]">
          {memorial.closingHeading}
        </h2>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-warm-grey">{memorial.closingText}</p>
      </div>
    </section>
  );
}
