import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Memorial",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="font-serif text-4xl text-charcoal">Memorial</h1>
        <p className="mt-4 max-w-md text-warm-grey">
          We could not find that page.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Back to LifeMarked
        </Link>
      </main>
      <Footer />
    </div>
  );
}
