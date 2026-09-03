"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#memorials", label: "Memorials" },
  { href: "#partners", label: "For partners" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePartnerClick = () => {
    trackEvent(ANALYTICS_EVENTS.navPartnerCta);
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border-warm bg-ivory/95 backdrop-blur-sm"
          : "border-b border-transparent bg-ivory/80 backdrop-blur-sm"
      }`}
    >
      <nav
        className="mx-auto flex h-14 max-w-[76rem] items-center justify-between px-5 md:h-16 md:px-10"
        aria-label="Main"
      >
        <a href="#top" className="flex items-center">
          <Image
            src="/Logo_Wide_NoBG.png"
            alt="Life Marked"
            width={180}
            height={40}
            className="h-8 w-auto md:h-9"
            priority
          />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.8125rem] text-warm-grey transition-colors hover:text-charcoal"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            className="text-[0.8125rem] text-warm-grey transition-colors hover:text-charcoal"
          >
            Sign in
          </a>
          <a href="#contact" className="btn-primary text-sm" onClick={handlePartnerClick}>
            Become a partner
          </a>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="relative block h-px w-5 bg-charcoal before:absolute before:-top-1.5 before:block before:h-px before:w-5 before:bg-charcoal after:absolute after:top-1.5 after:block after:h-px after:w-5 after:bg-charcoal" />
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-border-warm bg-ivory px-5 pb-6 pt-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="block text-charcoal" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/login" className="block text-charcoal" onClick={() => setMenuOpen(false)}>
                Sign in
              </a>
            </li>
            <li>
              <a href="#contact" className="btn-primary mt-2 w-full" onClick={handlePartnerClick}>
                Become a partner
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
