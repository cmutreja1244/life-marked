const steps = [
  {
    number: "01",
    title: "Mark",
    description: "A discreet Life Marked marker is added to the memorial.",
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
    <section id="how-it-works" className="section-pad border-t border-border-warm bg-ivory">
      <div className="content-width grid gap-0 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`py-5 md:px-8 md:py-0 ${index > 0 ? "border-t border-border-warm md:border-t-0 md:border-l" : ""} ${index === 0 ? "md:pl-0" : ""} ${index === 2 ? "md:pr-0" : ""}`}
          >
            <span className="font-serif text-2xl text-bronze/70">{step.number}</span>
            <h3 className="mt-2 font-serif text-xl text-charcoal">{step.title}</h3>
            <p className="mt-2 text-base text-warm-grey">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
