const points = [
  {
    title: "Family-owned",
    text: "Your memories and media remain yours.",
  },
  {
    title: "Portable",
    text: "Memorial content is designed to be exportable.",
  },
  {
    title: "Direct",
    text: "Memorial links should not depend on temporary third-party QR redirect services.",
  },
];

export function Longevity() {
  return (
    <section className="space-section-md bg-deep-charcoal text-ivory">
      <div className="content-width mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl">Built for memories that matter.</h2>
        <p className="mt-5 max-w-xl text-ivory/70">
          Families should never be trapped inside a proprietary memorial platform.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {points.map((point) => (
            <div key={point.title}>
              <h3 className="font-serif text-lg">{point.title}</h3>
              <p className="mt-2 text-sm text-ivory/60">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
