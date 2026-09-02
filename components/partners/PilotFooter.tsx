import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { SITE_URL } from "@/lib/pilot";

export function PilotFooter() {
  return (
    <footer className="pilot-dark bg-deep-charcoal text-ivory">
      <div className="content-width py-10 md:py-14">
        <Image
          src="/Logo_Wide_NoBG_White.png"
          alt="Life Marked"
          width={180}
          height={40}
          className="h-8 w-auto"
        />
        <p className="mt-3 text-sm text-ivory/55">Every life leaves more than a name.</p>
        <p className="mt-6 text-sm text-ivory/55">
          <Link href="/" className="hover:text-ivory">
            lifemarked.co.uk
          </Link>
          <span className="mx-2 text-ivory/25">·</span>
          <a href={`mailto:${COMPANY.supportEmail}`} className="hover:text-ivory">
            {COMPANY.supportEmail}
          </a>
        </p>
        <p className="mt-8 border-t border-ivory/10 pt-6 text-sm text-ivory/40">
          Private launch-partner overview
        </p>
        <p className="mt-2 hidden text-sm text-ivory/40 print:block">
          {SITE_URL}/partners/pilot
        </p>
      </div>
    </footer>
  );
}
