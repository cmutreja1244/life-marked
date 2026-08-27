import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-deep-charcoal text-ivory">
      <div className="content-width flex flex-col justify-center gap-3 py-9 md:flex-row md:items-center md:justify-between md:py-10">
        <div>
          <Image
            src="/logo_square_noBG.png"
            alt="LifeMarked"
            width={48}
            height={48}
            className="h-10 w-10"
          />
          <p className="mt-2 text-sm text-ivory/50">An AlbaNova concept</p>
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
