const steps = [
  "Offer LifeMarked",
  "Family selects it",
  "LifeMarked marker is supplied",
  "Family builds their story",
  "Partner earns from the sale",
];

export function PartnerWorkflow() {
  return (
    <section className="section-padding border-t border-border-warm">
      <div className="content-width mx-auto max-w-lg">
        <p className="section-label">Partner workflow</p>
        <ol className="mt-10 space-y-0">
          {steps.map((step, index) => (
            <li key={step} className="relative pl-8">
              {index < steps.length - 1 && (
                <span
                  className="absolute left-[7px] top-8 h-full w-px bg-border-warm"
                  aria-hidden
                />
              )}
              <span
                className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border border-bronze bg-ivory"
                aria-hidden
              />
              <p className="pb-10 font-serif text-xl text-charcoal">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
