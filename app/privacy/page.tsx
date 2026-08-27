import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privacy Policy — Life Marked",
  description: "How Life Marked handles information submitted through this website.",
};

export default function PrivacyPage() {
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
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-warm-grey">Last updated: August 2026</p>
          <hr className="mt-8 border-border-warm" />

          <p className="mt-8 text-warm-grey">
            {COMPANY.legalName} (company number {COMPANY.companyNumber}), {COMPANY.address}, is
            the data controller for {COMPANY.tradingName}. VAT number: {COMPANY.vatNumber}.{" "}
            {COMPANY.tradingName} is a digital memorial service. For privacy requests, please
            use the{" "}
            <Link href="/#contact" className="text-link">
              contact form
            </Link>{" "}
            on our homepage and note that your message relates to privacy.
          </p>

          <h2 className="mt-14 font-serif text-2xl">What we collect</h2>
          <ul className="mt-5 list-disc space-y-4 pl-5 text-warm-grey">
            <li>
              <strong className="font-medium text-charcoal">Contact form details</strong> you
              provide — typically your name, business name, email address, and any optional
              website or message.
            </li>
            <li>
              <strong className="font-medium text-charcoal">How you reached this site</strong>{" "}
              such as a referrer or campaign parameters (for example UTM tags), so we can
              understand which channels bring memorial businesses to {COMPANY.tradingName}.
            </li>
            <li>
              <strong className="font-medium text-charcoal">Technical data</strong> such as IP
              address and basic server logs needed to operate and secure the website.
            </li>
            <li>
              <strong className="font-medium text-charcoal">Analytics</strong> about how the site
              is used — for example which sections are viewed and whether a contact form is
              started. This data is aggregated and does not include the content of form
              messages.
            </li>
          </ul>

          <h2 className="mt-14 font-serif text-2xl">Purposes and lawful bases</h2>
          <ul className="mt-5 list-disc space-y-4 pl-5 text-warm-grey">
            <li>
              <strong className="font-medium text-charcoal">Legitimate interests</strong> to
              respond to partner enquiries, operate and secure this website, prevent abuse, and
              understand how the site is used at an aggregated level.
            </li>
            <li>
              <strong className="font-medium text-charcoal">Legal obligation</strong> where we
              need to keep records for accounting, tax, or other legal requirements.
            </li>
          </ul>
          <p className="mt-5 text-warm-grey">
            We do not sell your information. We do not currently send marketing emails from this
            website.
          </p>

          <h2 className="mt-14 font-serif text-2xl">How we share data</h2>
          <p className="mt-5 text-warm-grey">
            We use a small number of service providers under contract to help us run the site.
            The relevant categories today are:
          </p>
          <ul className="mt-5 list-disc space-y-4 pl-5 text-warm-grey">
            <li>
              <strong className="font-medium text-charcoal">Hosting / CDN</strong> (Vercel) to
              serve the website and APIs.
            </li>
            <li>
              <strong className="font-medium text-charcoal">Enquiry handling</strong> to receive
              contact form submissions so we can respond to memorial businesses.
            </li>
            <li>
              <strong className="font-medium text-charcoal">Analytics</strong> (Vercel Analytics)
              to understand site usage in aggregate.
            </li>
          </ul>
          <p className="mt-5 text-warm-grey">
            We may also disclose information if required by law, or to protect our rights,
            visitors, or the security of the site.
          </p>

          <h2 className="mt-14 font-serif text-2xl">Retention</h2>
          <ul className="mt-5 list-disc space-y-4 pl-5 text-warm-grey">
            <li>
              <strong className="font-medium text-charcoal">Contact enquiries:</strong> for as
              long as needed to respond and manage partner relationships, unless a longer period
              is required by law or you ask us to delete your information sooner where
              permitted.
            </li>
            <li>
              <strong className="font-medium text-charcoal">Campaign attribution:</strong> stored
              in your browser for the session only, so we can associate an enquiry with how you
              found us.
            </li>
            <li>
              <strong className="font-medium text-charcoal">Analytics:</strong> retained in
              aggregated form by our analytics provider according to their service.
            </li>
          </ul>

          <h2 className="mt-14 font-serif text-2xl">International transfers</h2>
          <p className="mt-5 text-warm-grey">
            Some of our service providers may process data outside the UK. Where they do, we
            rely on appropriate safeguards such as UK adequacy regulations or standard
            contractual clauses.
          </p>

          <h2 className="mt-14 font-serif text-2xl">Your rights</h2>
          <p className="mt-5 text-warm-grey">
            Under UK GDPR you may have rights to access, rectify, erase, restrict, object, and
            data portability. To make a request, please use the{" "}
            <Link href="/#contact" className="text-link">
              contact form
            </Link>{" "}
            and note that your message relates to privacy. You may complain to the Information
            Commissioner&apos;s Office at{" "}
            <a
              href="https://ico.org.uk"
              className="text-link"
              target="_blank"
              rel="noreferrer"
            >
              ico.org.uk
            </a>
            .
          </p>

          <h2 className="mt-14 font-serif text-2xl">Cookies and similar technologies</h2>
          <p className="mt-5 text-warm-grey">We use the following first-party storage:</p>
          <ul className="mt-5 list-disc space-y-4 pl-5 text-warm-grey">
            <li>
              <strong className="font-medium text-charcoal">Attribution</strong> in session
              storage (<code className="text-[0.9em] text-charcoal">lifemarked_utm</code>) to
              remember how you found us during the same visit. This is used for enquiry
              measurement, not third-party advertising.
            </li>
            <li>
              <strong className="font-medium text-charcoal">Anonymous analytics</strong> via
              Vercel Analytics, which is designed to be privacy-friendly and does not use
              advertising cookies.
            </li>
          </ul>
          <p className="mt-5 text-warm-grey">
            We do not currently run third-party advertising cookies or a cookie consent banner.
            If we introduce non-essential trackers that require consent under PECR, we will
            update this policy and seek consent where required.
          </p>

          <h2 className="mt-14 font-serif text-2xl">Changes</h2>
          <p className="mt-5 text-warm-grey">
            We may update this policy from time to time. The “Last updated” date on this page
            will change when we do.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
