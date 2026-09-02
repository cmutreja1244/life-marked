"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type MemorialTopBarProps = {
  shareTitle: string;
  shareText: string;
};

export function MemorialTopBar({ shareTitle, shareText }: MemorialTopBarProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-warm bg-ivory/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-12 max-w-[76rem] items-center justify-between px-5 md:h-14 md:px-10"
        aria-label="Memorial"
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

        <div className="flex items-center gap-5 text-sm text-warm-grey">
          <Link href="/" className="hidden hover:text-charcoal sm:inline">
            About LifeMarked
          </Link>
          <button
            type="button"
            className="min-h-10 text-charcoal hover:text-bronze focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
            onClick={handleShare}
            aria-live="polite"
          >
            {copied ? "Link copied" : "Share"}
          </button>
        </div>
      </nav>
    </header>
  );
}
