import Image from "next/image";

const locations = [
  { src: "/images/hero-margaret-memorial.webp", label: "Headstones" },
  { src: "/images/bench-memorial.webp", label: "Memorial benches" },
  { src: "/images/garden-memorial.webp", label: "Places that mattered" },
];

export function MemorialLocations() {
  return (
    <section className="space-section-lg border-t border-border-warm">
      <div className="content-width mx-auto">
        <h2 className="max-w-lg font-serif text-3xl leading-tight text-charcoal md:text-[2.65rem]">
          Stories can live wherever memories do.
        </h2>
        <p className="mt-5 max-w-xl text-warm-grey">
          From headstones and benches to gardens, plaques and places with personal meaning.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {locations.map((loc) => (
            <figure key={loc.label} className="relative min-h-[320px] md:min-h-[400px]">
              <Image src={loc.src} alt={loc.label} fill className="object-cover" sizes="33vw" />
              <figcaption className="absolute bottom-0 left-0 bg-deep-charcoal/70 px-4 py-3">
                <span className="font-serif text-lg text-ivory">{loc.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
