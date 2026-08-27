import Image from "next/image";

export function PhysicalProduct() {
  return (
    <section className="bg-stone">
      <div className="content-width section-pad-md">
        <div className="grid items-center gap-8 md:grid-cols-[58%_42%] md:gap-12">
          <div className="order-2 relative aspect-[16/10] w-full overflow-hidden img-radius md:order-1 md:aspect-auto md:h-[480px]">
            <Image
              src="/images/plaque-product.webp"
              alt="Life Marked brushed steel marker"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="font-serif text-[2rem] leading-tight text-charcoal md:text-[3.25rem]">
              Designed to belong.
            </h2>
            <p className="mt-4 text-lg text-warm-grey">
              A Life Marked marker should feel part of the memorial, not something added afterwards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
