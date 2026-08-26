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
    <section className="section-pad bg-deep-charcoal text-ivory">
      <div className="content-width grid gap-8 md:grid-cols-[42%_58%] md:items-start md:gap-12">
        <div>
          <h2 className="font-serif text-[1.85rem] leading-tight md:text-[2.5rem]">
            Built for memories that matter.
          </h2>
          <p className="mt-4 text-ivory/70">
            Families should never be trapped inside a proprietary memorial platform.
          </p>
        </div>
        <div>
          {points.map((point, i) => (
            <div
              key={point.title}
              className={`py-5 ${i > 0 ? "border-t border-ivory/15" : ""}`}
            >
              <p className="text-ivory">
                <span className="font-serif text-lg">{point.title}</span>
                <span className="text-ivory/60"> — {point.text}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
