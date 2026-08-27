import Image from "next/image";
import { COMPANY } from "@/lib/company";

export function Footer() {
  return (
    <footer className="bg-deep-charcoal text-ivory">
      <div className="content-width py-10 md:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Image
              src="/Logo_Wide_NoBG_White.png"
              alt="Life Marked"
              width={180}
              height={40}
              className="h-8 w-auto md:h-9"
            />
            <p className="mt-3 text-sm text-ivory/50">Every life leaves more than a name.</p>
            <p className="mt-6 text-sm leading-relaxed text-ivory/45">{COMPANY.address}</p>
            <p className="mt-2 text-sm text-ivory/45">VAT {COMPANY.vatNumber}</p>
          </div>

          <nav aria-label="Footer" className="flex gap-8 text-sm text-ivory/55">
            <a href="/privacy" className="hover:text-ivory">
              Privacy
            </a>
            <a href="/#contact" className="hover:text-ivory">
              Contact
            </a>
          </nav>
        </div>

        <p className="mt-10 border-t border-ivory/10 pt-6 text-sm text-ivory/35">
          © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
