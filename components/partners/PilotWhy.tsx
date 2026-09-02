const reasons = [
  {
    title: "A new premium add-on",
    body: "Generate incremental revenue from the same customer relationship.",
  },
  {
    title: "More meaningful personalisation",
    body: "Offer families something beyond stone, engraving and a traditional plaque.",
  },
  {
    title: "Differentiation",
    body: "Provide a modern memorial service many competitors still do not offer.",
  },
  {
    title: "Minimal operational burden",
    body: "LifeMarked handles the digital experience and family content journey.",
  },
];

export function PilotWhy() {
  return (
    <section className="bg-stone">
      <div className="content-width py-12 md:py-20">
        <h2 className="font-serif text-[2rem] leading-tight text-charcoal md:text-[2.75rem]">
          Why partners are interested
        </h2>
        <p className="mt-4 max-w-2xl text-[1.1rem] leading-relaxed text-warm-grey">
          Families increasingly want memorials to reflect the person behind the
          inscription. LifeMarked gives memorial businesses a simple way to offer that
          richer experience without building or managing the technology themselves.
        </p>

        <div className="mt-10 max-w-3xl">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className={`pilot-avoid-break py-6 ${index > 0 ? "border-t border-border-warm" : ""}`}
            >
              <h3 className="font-serif text-xl text-charcoal">{reason.title}</h3>
              <p className="mt-2 text-[1.05rem] leading-relaxed text-warm-grey">
                {reason.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
