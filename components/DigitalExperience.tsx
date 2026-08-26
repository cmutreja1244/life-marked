import Image from "next/image";

const capabilities = [
  "Biography",
  "Timeline",
  "Photographs",
  "Audio",
  "Video",
  "Memories",
  "Places",
  "Favourite things",
  "Family contributions",
];

export function DigitalExperience() {
  return (
    <section className="section-padding bg-deep-charcoal text-ivory">
      <div className="content-width mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-serif text-3xl leading-tight md:text-[2.65rem]">
            More than a profile. A life remembered beautifully.
          </h2>
          <p className="mt-6 text-ivory/75">
            The digital memorial experience is designed to feel like a carefully
            produced life story — not a social profile or database entry.
          </p>
          <ul className="mt-10 space-y-3 border-t border-ivory/15 pt-8">
            {capabilities.map((item) => (
              <li key={item} className="flex items-baseline gap-3 text-ivory/85">
                <span className="text-bronze">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[3/4] overflow-hidden editorial-border md:aspect-[4/5]">
          <Image
            src="/images/phone-profile.png"
            alt="Digital memorial experience showing Margaret Campbell's life story on a phone"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
