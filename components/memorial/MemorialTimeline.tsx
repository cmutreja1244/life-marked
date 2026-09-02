import type { Memorial } from "@/data/memorials/types";

export function MemorialTimeline({ memorial }: { memorial: Memorial }) {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-[40rem] px-5 py-12 md:px-10 md:py-20">
        <h2 className="font-serif text-[2rem] text-charcoal md:text-[2.75rem]">A life in moments</h2>
        <ol className="mt-10">
          {memorial.timeline.map((item, index) => (
            <li key={item.year} className="grid grid-cols-[4.5rem_1fr] gap-5 md:grid-cols-[5.5rem_1fr]">
              <div className="flex flex-col items-center">
                <span className="font-serif text-xl text-bronze md:text-2xl">{item.year}</span>
                {index < memorial.timeline.length - 1 && (
                  <span className="mt-2 w-px flex-1 bg-bronze/25" aria-hidden />
                )}
              </div>
              <div className={index < memorial.timeline.length - 1 ? "pb-8" : ""}>
                <h3 className="font-serif text-xl text-charcoal">{item.title}</h3>
                <p className="mt-1 text-[1.05rem] leading-relaxed text-warm-grey">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
