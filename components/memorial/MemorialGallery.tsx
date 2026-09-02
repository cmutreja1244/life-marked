import Image from "next/image";
import type { GalleryItem, Memorial } from "@/data/memorials/types";

function GalleryFigure({
  item,
  className,
  sizes,
}: {
  item: GalleryItem;
  className: string;
  sizes: string;
}) {
  const aspect =
    item.layout === "portrait"
      ? "aspect-[3/4] md:h-full md:aspect-auto"
      : item.layout === "landscape" || item.layout === "wide"
        ? "aspect-[16/10]"
        : "aspect-[3/4]";

  return (
    <figure className={className}>
      <div className={`relative overflow-hidden img-radius ${aspect}`}>
        <Image src={item.src} alt={item.alt} fill className="object-cover" sizes={sizes} />
      </div>
      <figcaption className="mt-2 text-sm text-warm-grey">{item.caption}</figcaption>
    </figure>
  );
}

export function MemorialGallery({ memorial }: { memorial: Memorial }) {
  const byLayout = (layout: GalleryItem["layout"]) =>
    memorial.gallery.filter((item) => item.layout === layout);

  const landscape = byLayout("landscape")[0];
  const portrait = byLayout("portrait")[0];
  const pairs = byLayout("pair");
  const wide = byLayout("wide")[0];
  const standard = byLayout("standard")[0];

  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-[76rem] px-5 py-12 md:px-10 md:py-20">
        <h2 className="font-serif text-[2rem] text-charcoal md:text-[2.75rem]">
          A life in photographs
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:grid-rows-[auto_auto_auto]">
          {landscape && (
            <GalleryFigure
              item={landscape}
              className="md:col-span-2"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          )}
          {portrait && (
            <GalleryFigure
              item={portrait}
              className="md:row-span-2 md:min-h-[28rem]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          {pairs.map((item) => (
            <GalleryFigure
              key={item.src}
              item={item}
              className=""
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ))}
          {wide && (
            <GalleryFigure
              item={wide}
              className="md:col-span-2"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          )}
          {standard && (
            <GalleryFigure
              item={standard}
              className=""
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </div>
      </div>
    </section>
  );
}
