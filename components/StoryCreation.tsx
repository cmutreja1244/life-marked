const sources = [
  "Photographs",
  "Eulogies",
  "Family memories",
  "Voice recordings",
  "Documents",
  "Family contributions",
];

export function StoryCreation() {
  return (
    <section className="section-padding">
      <div className="content-width mx-auto grid gap-12 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <h2 className="font-serif text-3xl leading-tight text-charcoal md:text-[2.65rem]">
            Every family has the memories. We help shape the story.
          </h2>
          <p className="mt-6 max-w-lg text-lg text-warm-grey">
            Families can bring together photographs, memories, recordings and
            existing documents. LifeMarked is being designed to help organise
            them into a beautifully structured life story.
          </p>
        </div>

        <ul className="space-y-4 border-l border-border-warm pl-8">
          {sources.map((source) => (
            <li key={source} className="text-charcoal">
              {source}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
