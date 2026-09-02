import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Terms of use — Life Marked",
  description: "Terms for using the LifeMarked website and memorial service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <header className="border-b border-border-warm px-5 py-6 md:px-10">
        <div className="content-width mx-auto">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/Logo_Wide_NoBG.png"
              alt="Life Marked"
              width={180}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="px-5 py-14 md:px-10 md:py-20">
        <article className="mx-auto max-w-[42rem]">
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">Terms of use</h1>
          <p className="mt-4 text-sm text-warm-grey">Last updated: September 2026</p>
          <hr className="mt-8 border-border-warm" />

          <p className="mt-8 text-warm-grey">
            These terms apply to this website and, when the family application is in use, to
            LifeMarked memorials operated by {COMPANY.legalName}. They are an interim public
            statement pending a full legal review. They are not a substitute for counsel.
          </p>

          <h2 className="mt-14 font-serif text-2xl">The service</h2>
          <p className="mt-5 text-warm-grey">
            {COMPANY.tradingName} connects a physical memorial marker to a digital life story.
            Partner enquiries on this site do not create a contract until we confirm a launch
            partnership in writing.
          </p>

          <h2 className="mt-14 font-serif text-2xl">Your content</h2>
          <p className="mt-5 text-warm-grey">
            Families and contributors must only submit material they have the right to share.
            The memorial owner may edit or remove contributions. We may disable a memorial if
            we receive a genuine concern about safety or legality.
          </p>

          <h2 className="mt-14 font-serif text-2xl">Privacy</h2>
          <p className="mt-5 text-warm-grey">
            How we handle personal information is described in our{" "}
            <Link href="/privacy" className="text-link">
              privacy policy
            </Link>
            .
          </p>

          <h2 className="mt-14 font-serif text-2xl">Contact</h2>
          <p className="mt-5 text-warm-grey">
            {COMPANY.legalName}, {COMPANY.address}.{" "}
            <a href={`mailto:${COMPANY.supportEmail}`} className="text-link">
              {COMPANY.supportEmail}
            </a>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
