const steps = [
  {
    number: "01",
    title: "You offer LifeMarked",
    body: "Introduce LifeMarked as an optional premium add-on when a family is choosing or personalising a memorial.",
  },
  {
    number: "02",
    title: "We take it from there",
    body: "LifeMarked guides the family through the content process, creates the digital memorial and prepares the engraved marker.",
  },
  {
    number: "03",
    title: "You earn from the sale",
    body: "The partner earns a margin on every LifeMarked order, without needing to build, host or support any technology.",
  },
];

export function PilotModel() {
  return (
    <section className="bg-stone">
      <div className="content-width py-12 md:py-20">
        <h2 className="max-w-2xl font-serif text-[2rem] leading-tight text-charcoal md:text-[2.75rem]">
          Designed to fit into the sale you already make.
        </h2>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {steps.map((step) => (
            <li key={step.number} className="pilot-avoid-break">
              <p className="section-label text-bronze">Step {step.number}</p>
              <h3 className="mt-3 font-serif text-[1.65rem] leading-snug text-charcoal">
                {step.title}
              </h3>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-warm-grey">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
