const partnerDoes = [
  "Introduce LifeMarked to suitable families",
  "Include it as an optional add-on during the memorial sale",
  "Confirm where the physical marker should be fitted",
  "Install or coordinate fitting where appropriate",
];

const lifeMarkedHandles = [
  "Family onboarding",
  "Gathering photographs, memories and media",
  "Creation of the digital memorial",
  "QR generation",
  "Engraved marker preparation",
  "Digital hosting",
  "Customer support for the digital memorial",
  "Ongoing platform operation",
];

export function PilotWorkload() {
  return (
    <section className="bg-stone">
      <div className="content-width py-12 md:py-20">
        <h2 className="max-w-4xl font-serif text-[2rem] leading-tight text-charcoal md:text-[2.75rem]">
          We keep the partner workload deliberately light.
        </h2>

        <div className="mt-10 grid items-start border-y border-border-warm sm:grid-cols-2">
          <div className="pilot-avoid-break py-8 sm:border-r sm:border-border-warm sm:py-10 sm:pr-10 md:pr-14">
            <h3 className="font-serif text-[1.65rem] text-charcoal">What you do</h3>
            <ul className="mt-6 space-y-3 text-[1.05rem] text-charcoal">
              {partnerDoes.map((item) => (
                <li key={item} className="border-l border-bronze/40 pl-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="pilot-avoid-break border-t border-border-warm py-8 sm:border-t-0 sm:py-10 sm:pl-10 md:pl-14">
            <h3 className="font-serif text-[1.65rem] text-charcoal">
              What LifeMarked handles
            </h3>
            <ul className="mt-6 space-y-3 text-[1.05rem] text-charcoal">
              {lifeMarkedHandles.map((item) => (
                <li key={item} className="border-l border-bronze/40 pl-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="pilot-avoid-break mt-8 grid items-start gap-4 bg-ivory px-6 py-6 sm:grid-cols-2 sm:gap-12 sm:px-10 sm:py-8">
          <p className="font-serif text-xl text-charcoal md:text-[1.45rem]">
            No software implementation required.
          </p>
          <p className="text-[1.05rem] leading-relaxed text-warm-grey">
            No CRM integration, POS integration, funeral-management integration, staff
            dashboard, software licence or monthly partner subscription. For the pilot,
            LifeMarked is intentionally standalone.
          </p>
        </aside>
      </div>
    </section>
  );
}
