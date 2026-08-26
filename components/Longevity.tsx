const points = [
  { title: "Portable by design", text: "Memorial content families can keep and move." },
  { title: "Family-owned", text: "The story belongs to those who knew the person." },
  { title: "Built without lock-in", text: "No reliance on one proprietary platform forever." },
];

export function Longevity() {
  return (
    <section className="space-section-md">
      <div className="content-width mx-auto text-center">
        <h2 className="font-serif text-2xl text-charcoal md:text-3xl">
          Made for memories that matter.
        </h2>
        <div className="mx-auto mt-12 grid max-w-3xl gap-10 md:grid-cols-3 md:gap-8">
          {points.map((point) => (
            <div key={point.title}>
              <h3 className="font-serif text-lg text-charcoal">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-warm-grey">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
