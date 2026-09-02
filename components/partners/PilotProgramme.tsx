const points = [
  "No setup fee for the partner",
  "No software cost",
  "No minimum order commitment",
  "LifeMarked works closely with the partner during the first orders",
  "Gather feedback on customer response",
  "Refine pricing, fitting and fulfilment before wider rollout",
];

export function PilotProgramme() {
  return (
    <section className="pilot-dark bg-deep-charcoal text-ivory">
      <div className="content-width py-12 md:py-20">
        <p className="section-label text-ivory/45">The launch-partner pilot</p>
        <h2 className="mt-3 max-w-2xl font-serif text-[2rem] leading-tight md:text-[2.75rem]">
          We’re inviting a small number of memorial businesses to help shape the first
          LifeMarked rollout.
        </h2>
        <p className="mt-6 max-w-2xl text-[1.1rem] leading-relaxed text-ivory/75">
          There is no cost to the partner to participate in the pilot. The family still
          pays the relevant LifeMarked retail price unless something different is
          explicitly agreed later.
        </p>

        <ul className="mt-10 max-w-2xl space-y-3 text-[1.05rem] text-ivory/85">
          {points.map((point) => (
            <li key={point} className="border-l border-ivory/20 pl-4">
              {point}
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-2xl font-serif text-xl leading-snug text-ivory">
          The aim is simple: prove that families want it and make the process
          effortless for the partner.
        </p>
      </div>
    </section>
  );
}
