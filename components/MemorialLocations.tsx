import Image from "next/image";

const locations = [
  { src: "/images/headstone-memorial.png", label: "Headstones", span: "col-span-2 row-span-2" },
  { src: "/images/bench-memorial.png", label: "Memorial benches", span: "col-span-1 row-span-1" },
  { src: "/images/plaque-closeup.png", label: "Plaques", span: "col-span-1 row-span-1" },
  { src: "/images/hero-memorial.png", label: "Memorial gardens", span: "col-span-2 row-span-1" },
  { src: "/images/bench-memorial.png", label: "Private memorials", span: "col-span-1 row-span-1" },
  { src: "/images/headstone-memorial.png", label: "Cremation memorials", span: "col-span-1 row-span-1" },
];

export function MemorialLocations() {
  return (
    <section className="section-padding">
      <div className="content-width mx-auto">
        <h2 className="max-w-lg font-serif text-3xl leading-tight text-charcoal md:text-[2.65rem]">
          Stories can live wherever memories do.
        </h2>

        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
          {locations.map((loc, i) => (
            <figure
              key={`${loc.label}-${i}`}
              className={`group relative overflow-hidden editorial-border ${loc.span}`}
            >
              <Image
                src={loc.src}
                alt={loc.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <figcaption className="absolute bottom-0 left-0 bg-gradient-to-t from-deep-charcoal/70 to-transparent p-4 pt-12 text-sm text-ivory">
                {loc.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
