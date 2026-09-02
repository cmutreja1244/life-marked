"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function PilotTopBar({ partnerName }: { partnerName: string | null }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-warm bg-ivory/95 backdrop-blur-sm print:hidden">
      <nav
        className="content-width flex h-12 items-center justify-between md:h-14"
        aria-label="Launch partner"
      >
        <Link href="/" className="flex items-center" aria-label="Life Marked">
          <Image
            src="/Logo_Wide_NoBG.png"
            alt="Life Marked"
            width={140}
            height={32}
            className="h-6 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-4 text-sm text-warm-grey md:gap-5">
          <p className="hidden text-[0.7rem] tracking-[0.12em] uppercase sm:block">
            Launch Partner Pilot
          </p>
          <button
            type="button"
            className="min-h-10 text-charcoal hover:text-bronze focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
            onClick={copyLink}
            aria-live="polite"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
          <button
            type="button"
            className="min-h-10 text-charcoal hover:text-bronze focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
            onClick={() => window.print()}
          >
            <span className="sm:hidden">Print</span>
            <span className="hidden sm:inline">Print / save overview</span>
          </button>
        </div>
      </nav>
      {partnerName ? (
        <p className="content-width pb-3 text-sm text-warm-grey">
          Prepared for {partnerName}
        </p>
      ) : null}
    </header>
  );
}
