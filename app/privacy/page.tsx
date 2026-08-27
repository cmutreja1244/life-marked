import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — LifeMarked",
  description: "How LifeMarked handles information submitted through this website.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <header className="border-b border-border-warm px-5 py-6 md:px-10">
        <div className="content-width mx-auto">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/Logo_Wide_NoBG.png"
              alt="LifeMarked"
              width={180}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="section-padding">
        <article className="content-width prose-width mx-auto">
          <h1 className="font-serif text-3xl">Privacy</h1>
          <p className="mt-6 text-warm-grey">
            LifeMarked is an AlbaNova concept website used to introduce the
            product to memorial businesses. This page explains how we handle
            information when you use this site.
          </p>

          <h2 className="mt-10 font-serif text-xl">Information we collect</h2>
          <p className="mt-4 text-warm-grey">
            If you use the contact form, we collect the details you provide —
            typically your name, business name, email address, optional website,
            and optional message. We may also record how you reached this site
            (for example, referrer or campaign parameters) to understand interest
            in LifeMarked.
          </p>

          <h2 className="mt-10 font-serif text-xl">How we use it</h2>
          <p className="mt-4 text-warm-grey">
            Contact form submissions are used to respond to enquiries about the
            LifeMarked pilot and to follow up with memorial businesses who express
            interest. We do not sell your information.
          </p>

          <h2 className="mt-10 font-serif text-xl">Analytics</h2>
          <p className="mt-4 text-warm-grey">
            We use Vercel Analytics to understand how visitors use this website —
            for example, which sections are viewed and whether forms are started.
            This helps us improve the site. Analytics data is aggregated and does
            not include the content of contact form messages.
          </p>

          <h2 className="mt-10 font-serif text-xl">Cookies</h2>
          <p className="mt-4 text-warm-grey">
            This site may use cookies or similar technologies in connection with
            analytics. Campaign parameters may be stored temporarily in your
            browser session to associate an enquiry with how you found us.
          </p>

          <h2 className="mt-10 font-serif text-xl">Data retention</h2>
          <p className="mt-4 text-warm-grey">
            We retain contact enquiries for as long as needed to respond and
            manage the LifeMarked pilot, unless a longer period is required by
            law or you ask us to delete your information sooner.
          </p>

          <h2 className="mt-10 font-serif text-xl">Your rights</h2>
          <p className="mt-4 text-warm-grey">
            You may ask for access to, correction of, or deletion of personal
            information you have submitted through this site.
          </p>

          <h2 className="mt-10 font-serif text-xl">Contact</h2>
          <p className="mt-4 text-warm-grey">
            For any privacy-related request, please use the{" "}
            <Link href="/#contact" className="text-link">
              contact form
            </Link>{" "}
            on our homepage and note that your message relates to privacy.
          </p>

          <p className="mt-12 text-sm text-warm-grey">
            Last updated: August 2026
          </p>
        </article>
      </main>
    </div>
  );
}
