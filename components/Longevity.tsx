const principles = [
  {
    title: "Direct memorial URLs",
    text: "Each memorial is intended to have its own permanent web address.",
  },
  {
    title: "Downloadable archives",
    text: "Families should be able to keep a complete copy of their memorial content.",
  },
  {
    title: "Exportable data",
    text: "Content and media designed to move with the family — not lock them in.",
  },
  {
    title: "Family ownership",
    text: "The story belongs to those who knew the person, not to the platform.",
  },
];

export function Longevity() {
  return (
    <section className="section-padding border-t border-border-warm">
      <div className="content-width mx-auto">
        <h2 className="max-w-2xl font-serif text-3xl leading-tight text-charcoal md:text-[2.65rem]">
          A memorial should outlive the technology behind it.
        </h2>
        <p className="mt-6 max-w-xl text-warm-grey">
          LifeMarked is being designed with portability and family ownership in
          mind — thoughtful architecture, not empty promises.
        </p>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {principles.map((item) => (
            <div key={item.title} className="max-w-md">
              <h3 className="font-serif text-xl text-charcoal">{item.title}</h3>
              <p className="mt-3 text-warm-grey">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
