"use client";

import { useEffect, useState } from "react";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

const navLinks = [
  { href: "#story", label: "The story" },
  { href: "#memorials", label: "Memorials" },
  { href: "#partners", label: "For partners" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setOverHero(y < window.innerHeight * 0.75);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const light = overHero && !scrolled;
  const handlePartnerClick = () => {
    trackEvent(ANALYTICS_EVENTS.navPartnerCta);
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border-warm bg-ivory/90 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-deep-charcoal/40 to-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-[3.75rem] max-w-[76rem] items-center justify-between px-5 md:h-16 md:px-10"
        aria-label="Main"
      >
        <a
          href="#top"
          className={`font-serif text-[1.2rem] tracking-tight transition-colors md:text-[1.3rem] ${
            light && !menuOpen ? "text-ivory" : "text-charcoal"
          }`}
        >
          LifeMarked
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[0.8125rem] tracking-wide transition-colors ${
                light ? "text-ivory/75 hover:text-ivory" : "text-warm-grey hover:text-charcoal"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className={`text-[0.8125rem] font-medium tracking-wide transition-colors ${
              light
                ? "text-ivory underline decoration-ivory/40 underline-offset-4 hover:decoration-ivory"
                : "text-charcoal underline decoration-charcoal/30 underline-offset-4 hover:decoration-bronze"
            }`}
            onClick={handlePartnerClick}
          >
            Become a launch partner
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
          <span
            className={`relative block h-px w-5 before:absolute before:-top-1.5 before:block before:h-px before:w-5 after:absolute after:top-1.5 after:block after:h-px after:w-5 ${
              light && !menuOpen
                ? "bg-ivory before:bg-ivory after:bg-ivory"
                : "bg-charcoal before:bg-charcoal after:bg-charcoal"
            }`}
          />
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border-warm bg-ivory px-5 pb-6 pt-4 md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-base text-charcoal"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="text-link mt-2 block" onClick={handlePartnerClick}>
                Become a launch partner
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
