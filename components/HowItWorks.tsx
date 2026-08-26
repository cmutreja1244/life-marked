const steps = [
  {
    number: "01",
    title: "Mark",
    description: "A discreet LifeMarked marker is added to the memorial.",
  },
  {
    number: "02",
    title: "Scan",
    description: "Visitors scan it with any smartphone camera. No app required.",
  },
  {
    number: "03",
    title: "Remember",
    description:
      "Photographs, stories, milestones, voices and memories bring the person behind the name to life.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border-warm space-section-md">
      <div className="content-width mx-auto">
        <div className="flex flex-col gap-10 md:flex-row md:gap-0">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex-1 md:px-8 ${index > 0 ? "md:border-l md:border-border-warm" : ""} ${index === 0 ? "md:pl-0" : ""}`}
            >
              <span className="font-serif text-3xl text-bronze/70">{step.number}</span>
              <h3 className="mt-3 font-serif text-xl text-charcoal">{step.title}</h3>
              <p className="mt-3 max-w-xs text-warm-grey">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
