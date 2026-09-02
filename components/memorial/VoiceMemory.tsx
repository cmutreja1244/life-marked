import Image from "next/image";
import type { Memorial } from "@/data/memorials/types";

const waveformHeights = [8, 18, 12, 28, 22, 10, 32, 16, 24, 14, 26, 18, 30, 12, 20, 28, 14, 22];

export function VoiceMemory({ memorial }: { memorial: Memorial }) {
  const voice = memorial.voiceMemory;

  return (
    <section className="bg-deep-charcoal text-ivory">
      <div className="mx-auto grid max-w-[76rem] items-center gap-10 px-5 py-12 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:px-10 md:py-20">
        <div>
          <p className="section-label text-bronze">{voice.label}</p>
          <p className="mt-4 text-[11px] font-medium tracking-[0.14em] text-ivory/45 uppercase">
            Voice memory
          </p>
          <h2 className="mt-3 font-serif text-[2rem] text-ivory md:text-[2.75rem]">{voice.title}</h2>
          <p className="mt-2 text-ivory/55">{voice.recorded}</p>
          <div className="mt-6 border-t border-ivory/15 pt-5" aria-hidden>
            <div className="flex h-8 items-end gap-[3px]">
              {waveformHeights.map((height, index) => (
                <div
                  key={index}
                  className="waveform-bar"
                  style={{ height: `${height}px`, opacity: 0.55 }}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-ivory/45">{voice.duration}</p>
          </div>
          <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-ivory/65">
            {voice.supportingText}
          </p>
        </div>

        <figure>
          <div className="relative aspect-[4/5] overflow-hidden img-radius md:aspect-[3/4]">
            <Image
              src={voice.image}
              alt={voice.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
