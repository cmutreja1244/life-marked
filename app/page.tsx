import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { EmotionalStatement } from "@/components/EmotionalStatement";
import { HowItWorks } from "@/components/HowItWorks";
import { MargaretStoryDemo } from "@/components/MargaretStoryDemo";
import { MemorialLocations } from "@/components/MemorialLocations";
import { PhysicalProduct } from "@/components/PhysicalProduct";
import { Longevity } from "@/components/Longevity";
import { Partners } from "@/components/Partners";
import { FinalCTA } from "@/components/FinalCTA";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <EmotionalStatement />
        <HowItWorks />
        <MargaretStoryDemo />
        <MemorialLocations />
        <PhysicalProduct />
        <Longevity />
        <Partners />
        <FinalCTA />
        <section id="contact" className="space-section-lg border-t border-border-warm">
          <div className="content-width mx-auto">
            <h2 className="font-serif text-3xl leading-tight text-charcoal md:text-4xl">
              Start a conversation.
            </h2>
            <p className="reading-width mt-5 text-warm-grey">
              If you sell memorials and would be interested in offering LifeMarked to your
              customers, we&apos;d love to hear from you.
            </p>
            <div className="mt-12">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
