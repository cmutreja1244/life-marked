const packages = [
  {
    name: "LifeMarked Essential",
    price: "£179",
    earnings: "£50",
    includes: [
      "Premium engraved LifeMarked marker",
      "Hosted digital memorial",
      "Biography / life story",
      "Photographs",
      "Life timeline",
      "Memories and tributes",
    ],
  },
  {
    name: "LifeMarked Story",
    price: "£249",
    earnings: "£70",
    includes: [
      "Everything in Essential",
      "Audio / preserved voice",
      "Video",
      "Richer multimedia",
      "Additional assistance creating the memorial",
    ],
  },
];

export function PilotPricing() {
  return (
    <section className="bg-ivory">
      <div className="content-width py-12 md:py-20">
        <div className="grid items-end gap-4 border-b border-border-warm pb-8 sm:grid-cols-2 sm:gap-12">
          <h2 className="font-serif text-[2rem] leading-tight text-charcoal md:text-[2.75rem]">
            Simple one-off pricing
          </h2>
          <p className="text-[1.1rem] leading-relaxed text-warm-grey">
            LifeMarked is designed as a one-time purchase for the family rather than
            another subscription.
          </p>
        </div>

        <div className="grid sm:grid-cols-2">
          {packages.map((item, index) => (
            <article
              key={item.name}
              className={`flex h-full flex-col py-8 sm:py-10 ${
                index === 0
                  ? "sm:border-r sm:border-border-warm sm:pr-10 md:pr-14"
                  : "sm:pl-10 md:pl-14"
              }`}
            >
              <h3 className="font-serif text-[1.65rem] text-charcoal">{item.name}</h3>
              <p className="mt-4 font-serif text-5xl leading-none text-charcoal md:text-6xl">
                {item.price}
              </p>
              <p className="mt-2 text-sm tracking-wide text-warm-grey uppercase">
                one-time
              </p>

              <ul className="mt-6 space-y-2 text-[1.05rem] text-charcoal">
                {item.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>

              <div className="mt-8 border-t border-border-warm pt-5 sm:mt-auto">
                <p className="section-label">Your indicative earnings</p>
                <p className="mt-2 font-serif text-4xl text-charcoal">{item.earnings}</p>
                <p className="mt-1 text-sm text-warm-grey">per sale</p>
              </div>
            </article>
          ))}
        </div>

        <p className="border-t border-border-warm pt-6 text-sm leading-relaxed text-warm-grey">
          Pilot pricing is indicative and may be refined with launch-partner feedback
          before wider rollout.
        </p>

        <div className="mt-8 grid items-start gap-4 border-t border-border-warm pt-8 sm:grid-cols-2 sm:gap-12">
          <h3 className="font-serif text-xl text-charcoal md:text-[1.65rem]">
            Bespoke / concierge memorials
          </h3>
          <p className="text-[1.05rem] leading-relaxed text-warm-grey">
            For families wanting more hands-on story curation or premium requirements,
            bespoke LifeMarked memorials are expected to start from approximately £399.
            Partner economics to be agreed depending on scope.
          </p>
        </div>
      </div>
    </section>
  );
}
