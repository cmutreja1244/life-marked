export function Footer() {
  return (
    <footer className="border-t border-border-warm">
      <div className="content-width flex h-[104px] flex-col justify-center gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-lg text-charcoal">LifeMarked</p>
          <p className="text-sm text-warm-grey">An AlbaNova concept</p>
        </div>
        <nav aria-label="Footer" className="flex gap-8 text-sm text-warm-grey">
          <a href="/privacy" className="hover:text-charcoal">
            Privacy
          </a>
          <a href="#contact" className="hover:text-charcoal">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
