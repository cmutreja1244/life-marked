export function PilotEconomics() {
  return (
    <section className="bg-ivory">
      <div className="content-width py-12 md:py-20">
        <div className="grid items-end gap-4 border-b border-border-warm pb-8 sm:grid-cols-2 sm:gap-12">
          <h2 className="font-serif text-[2rem] leading-tight text-charcoal md:text-[2.75rem]">
            What this can look like commercially
          </h2>
          <p className="text-[1.1rem] leading-relaxed text-warm-grey">
            A simple illustration of partner earnings. Not a forecast.
          </p>
        </div>

        <div className="grid items-stretch sm:grid-cols-2">
          <div className="pilot-avoid-break py-8 sm:border-r sm:border-border-warm sm:py-10 sm:pr-10 md:pr-14">
            <p className="section-label">Example A</p>
            <p className="mt-3 text-[1.05rem] text-charcoal">10 Essential sales</p>
            <p className="mt-4 font-serif text-5xl text-charcoal">£500</p>
            <p className="mt-2 text-sm text-warm-grey">partner earnings</p>
          </div>
          <div className="pilot-avoid-break border-t border-border-warm py-8 sm:border-t-0 sm:py-10 sm:pl-10 md:pl-14">
            <p className="section-label">Example B</p>
            <p className="mt-3 text-[1.05rem] text-charcoal">
              5 Essential + 5 Story sales
            </p>
            <p className="mt-2 text-sm text-warm-grey">
              5 × £50 = £250 · 5 × £70 = £350
            </p>
            <p className="mt-4 font-serif text-5xl text-charcoal">£600</p>
            <p className="mt-2 text-sm text-warm-grey">total partner earnings</p>
          </div>
        </div>
      </div>
    </section>
  );
}
