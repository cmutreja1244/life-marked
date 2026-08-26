const steps = [
  {
    number: "01",
    title: "Mark",
    description:
      "A discreet, weather-resistant LifeMarked marker is added to the memorial.",
  },
  {
    number: "02",
    title: "Scan",
    description: "Visitors scan it instantly using a phone camera. No app required.",
  },
  {
    number: "03",
    title: "Remember",
    description:
      "The person's story opens — photographs, milestones, memories, video, voice and contributions from people who knew them.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding border-t border-border-warm">
      <div className="content-width mx-auto">
        <p className="section-label">How it works</p>
        <div className="mt-12 flex flex-col gap-12 md:mt-16 md:flex-row md:gap-0">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex-1 md:px-8 ${index > 0 ? "md:border-l md:border-border-warm" : ""} ${index === 0 ? "md:pl-0" : ""}`}
            >
              <span className="font-serif text-4xl text-bronze/70">{step.number}</span>
              <h3 className="mt-4 font-serif text-2xl text-charcoal">{step.title}</h3>
              <p className="mt-4 max-w-sm text-warm-grey">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
