import Image from "next/image";

const locations = [
  {
    src: "/images/hero-margaret-memorial.webp",
    label: "Headstones",
    large: true,
  },
  {
    src: "/images/bench-memorial.webp",
    label: "Memorial benches",
    large: false,
  },
  {
    src: "/images/garden-memorial.webp",
    label: "Places that mattered",
    large: false,
  },
];

export function MemorialLocations() {
  return (
    <section className="section-pad-md border-t border-border-warm">
      <div className="content-width">
        <h2 className="max-w-xl font-serif text-[2rem] leading-tight text-charcoal md:text-[3rem]">
          Stories can live wherever memories do.
        </h2>
        <p className="mt-4 max-w-xl text-lg text-warm-grey">
          From headstones and benches to gardens, plaques and places with personal meaning.
        </p>

        <div className="mt-10 grid h-auto gap-4 md:h-[660px] md:grid-cols-[58%_42%] md:grid-rows-2">
          <figure className="relative min-h-[280px] overflow-hidden img-radius md:row-span-2 md:min-h-0">
            <Image
              src={locations[0].src}
              alt={locations[0].label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
            <figcaption className="absolute bottom-3 left-3 font-serif text-ivory">
              {locations[0].label}
            </figcaption>
          </figure>
          {locations.slice(1).map((loc) => (
            <figure key={loc.label} className="relative min-h-[200px] overflow-hidden img-radius md:min-h-0">
              <Image src={loc.src} alt={loc.label} fill className="object-cover" sizes="42vw" />
              <figcaption className="absolute bottom-3 left-3 font-serif text-ivory">
                {loc.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
