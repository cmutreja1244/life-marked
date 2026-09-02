import type { Memorial } from "@/data/memorials/types";

export function MemoryQuotes({ memorial }: { memorial: Memorial }) {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-[40rem] px-5 py-12 md:px-10 md:py-20">
        <h2 className="font-serif text-[2rem] leading-snug text-charcoal md:text-[2.75rem]">
          Remembered by the people who knew her
        </h2>
        <ul className="mt-12 space-y-12">
          {memorial.memories.map((memory) => (
            <li key={memory.author}>
              <blockquote className="font-serif text-[1.45rem] leading-snug text-charcoal md:text-[1.75rem]">
                &ldquo;{memory.quote}&rdquo;
              </blockquote>
              <p className="mt-3 text-sm text-warm-grey">{memory.author}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
