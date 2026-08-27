import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-deep-charcoal text-ivory">
      <div className="content-width flex flex-col justify-center gap-3 py-9 md:flex-row md:items-center md:justify-between md:py-10">
        <div>
          <Image
            src="/Logo_Wide_NoBG_White.png"
            alt="LifeMarked"
            width={180}
            height={40}
            className="h-8 w-auto md:h-9"
          />
          <p className="mt-2 text-sm text-ivory/50">Every life leaves more than a name.</p>
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
