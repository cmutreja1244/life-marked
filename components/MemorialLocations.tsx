import Image from "next/image";

const locations = [
  {
    src: "/images/hero-margaret-memorial.webp",
    title: "Headstone",
    caption: "Margaret's memorial — integrated at the stone's edge.",
    span: "md:col-span-2 md:row-span-2",
    tall: true,
  },
  {
    src: "/images/bench-memorial.webp",
    title: "Memorial bench",
    caption: "A bench in a garden she loved.",
    span: "md:col-span-1",
    tall: false,
  },
  {
    src: "/images/garden-memorial.webp",
    title: "A place that mattered",
    caption: "Trees, gardens, plaques and private memorials.",
    span: "md:col-span-1",
    tall: false,
  },
];

export function MemorialLocations() {
  return (
    <section className="space-section-lg">
      <div className="content-width mx-auto">
        <div className="mb-12 max-w-lg">
          <h2 className="font-serif text-3xl leading-tight text-charcoal md:text-[2.75rem]">
            Stories can live wherever memories do.
          </h2>
          <p className="mt-5 text-warm-grey">
            Headstones, benches, gardens, plaques, cremation memorials and
            private places — LifeMarked is designed to belong quietly within them.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 md:grid-rows-2 md:gap-4">
          {locations.map((loc) => (
            <figure
              key={loc.title}
              className={`group relative overflow-hidden ${loc.span} ${loc.tall ? "min-h-[420px] md:min-h-full" : "min-h-[280px]"}`}
            >
              <Image
                src={loc.src}
                alt={loc.title}
                fill
                className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep-charcoal/80 to-transparent p-6 pt-20 md:p-8">
                <p className="font-serif text-xl text-ivory">{loc.title}</p>
                <p className="mt-1 text-sm text-ivory/70">{loc.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
