export function Footer() {
  return (
    <footer className="border-t border-border-warm px-5 py-10 md:px-10">
      <div className="content-width mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-lg text-charcoal">LifeMarked</p>
          <p className="mt-1 text-sm text-warm-grey">An AlbaNova concept</p>
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
