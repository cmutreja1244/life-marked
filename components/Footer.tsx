export function Footer() {
  return (
    <footer className="bg-deep-charcoal text-ivory">
      <div className="content-width flex flex-col justify-center gap-3 py-9 md:flex-row md:items-center md:justify-between md:py-10">
        <div>
          <p className="font-serif text-lg text-ivory">LifeMarked</p>
          <p className="text-sm text-ivory/50">An AlbaNova concept</p>
        </div>
        <nav aria-label="Footer" className="flex gap-8 text-sm text-ivory/55">
          <a href="/privacy" className="hover:text-ivory">
            Privacy
          </a>
          <a href="#contact" className="hover:text-ivory">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
