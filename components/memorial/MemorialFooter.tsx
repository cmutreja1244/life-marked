import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/lib/company";

export function MemorialFooter() {
  return (
    <footer className="bg-ivory">
      <div className="mx-auto max-w-[40rem] px-5 py-12 text-center md:px-10 md:py-16">
        <Image
          src="/logo_square_noBG.png"
          alt="Life Marked"
          width={40}
          height={40}
          className="mx-auto h-9 w-9"
        />
        <p className="mt-4 text-sm text-charcoal">Created with {COMPANY.tradingName}</p>
        <p className="mt-1 text-sm text-warm-grey">Every life leaves more than a name.</p>
        <Link href="/" className="text-link mt-3 inline-block">
          lifemarked.co.uk
        </Link>
        <p className="mt-8 text-sm text-warm-grey">
          This is a fictional memorial created to demonstrate the LifeMarked experience.
        </p>
      </div>
    </footer>
  );
}
