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
    <section className="bg-ivory py-12 md:py-[72px]">
      <div className="content-width grid gap-8 md:grid-cols-[42%_58%] md:items-start md:gap-12">
        <div>
          <h2 className="font-serif text-[1.75rem] leading-tight text-charcoal md:text-[2.25rem]">
            Built for memories that matter.
          </h2>
          <p className="mt-3 text-warm-grey">
            Families should never be trapped inside a proprietary memorial platform.
          </p>
        </div>
        <div>
          {points.map((point, i) => (
            <div
              key={point.title}
              className={`py-4 ${i > 0 ? "border-t border-border-warm" : ""}`}
            >
              <p className="font-serif text-lg text-charcoal">{point.title}</p>
              <p className="mt-1 text-sm text-warm-grey">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
