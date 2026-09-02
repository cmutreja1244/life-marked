import Image from "next/image";

const types = [
  {
    src: "/images/hero-margaret-memorial.webp",
    label: "Headstones",
    alt: "Headstone with a discreet LifeMarked marker",
  },
  {
    src: "/images/bench-memorial.webp",
    label: "Memorial benches",
    alt: "Memorial bench in a garden setting",
  },
  {
    src: "/images/plaque-product.webp",
    label: "Memorial plaques",
    alt: "Brushed-metal LifeMarked plaque",
  },
  {
    src: "/images/garden-memorial.webp",
    label: "Gardens and remembrance places",
    alt: "Quiet memorial garden",
  },
];

export function PilotMarker() {
  return (
    <section className="bg-ivory">
      <div className="content-width py-12 md:py-20">
        <div className="grid items-start gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
          <div>
            <p className="section-label text-bronze">Pilot marker concept</p>
            <h2 className="mt-3 font-serif text-[2rem] leading-tight text-charcoal md:text-[2.75rem]">
              Designed to belong beside a permanent memorial.
            </h2>
            <p className="mt-4 text-[1.1rem] leading-relaxed text-warm-grey">
              The LifeMarked marker is intended to be discreet, engraved,
              weather-resistant, premium and visually restrained — suitable for
              appropriate stone, bench or plaque applications.
            </p>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-charcoal">
              Current working format: brushed metal / premium engraved finish, with the
              LM monogram and QR.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-warm-grey">
              Final manufacturing specification is still being refined for the pilot.
              Lifetime, weathering and material ratings have not been published yet.
            </p>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden img-radius md:aspect-auto md:min-h-[320px]">
            <Image
              src="/images/plaque-product.webp"
              alt="LifeMarked brushed-metal marker, pilot concept"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>

        <div className="mt-14">
          <h3 className="font-serif text-[1.65rem] text-charcoal">
            Suitable for several memorial settings
          </h3>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {types.map((item) => (
              <figure key={item.label} className="relative">
                <div className="relative aspect-[4/5] overflow-hidden img-radius">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <figcaption className="mt-2 text-sm text-warm-grey">{item.label}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-warm-grey">
            Installation and cemetery or burial-ground rules vary by location, so
            suitability is confirmed with the partner during the pilot. LifeMarked can
            also sit with memorial trees and other remembrance locations where the
            setting allows.
          </p>
        </div>
      </div>
    </section>
  );
}
