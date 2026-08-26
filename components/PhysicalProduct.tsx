import Image from "next/image";

const finishes = [
  {
    name: "Stone / Silver",
    description: "Brushed stainless steel.",
    image: "/images/plaque-closeup.png",
  },
  {
    name: "Heritage",
    description: "Muted brass or bronze.",
    image: "/images/headstone-memorial.png",
  },
  {
    name: "Discreet",
    description: "Small darker engraved marker.",
    image: "/images/bench-memorial.png",
  },
];

export function PhysicalProduct() {
  return (
    <section className="section-padding border-t border-border-warm">
      <div className="content-width mx-auto">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="font-serif text-3xl leading-tight text-charcoal md:text-[2.65rem]">
              Designed to belong.
            </h2>
            <p className="mt-6 max-w-md text-lg text-warm-grey">
              LifeMarked markers are designed to sit quietly within the memorial
              — not compete with it.
            </p>
            <p className="section-label mt-10">Concept finishes</p>
          </div>

          <div className="space-y-8">
            {finishes.map((finish) => (
              <div
                key={finish.name}
                className="grid grid-cols-[120px_1fr] items-center gap-6 border-b border-border-warm pb-8 last:border-0"
              >
                <div className="relative aspect-square overflow-hidden editorial-border">
                  <Image
                    src={finish.image}
                    alt={finish.name}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-charcoal">{finish.name}</h3>
                  <p className="mt-2 text-warm-grey">{finish.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
