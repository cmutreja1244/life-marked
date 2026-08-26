import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { NarrativeBridge } from "@/components/NarrativeBridge";
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
        <NarrativeBridge />
        <MargaretStoryDemo />
        <MemorialLocations />
        <PhysicalProduct />
        <Longevity />
        <Partners />
        <FinalCTA />
        <section id="contact" className="space-section-lg">
          <div className="content-width mx-auto">
            <p className="section-label">Enquiry</p>
            <h2 className="mt-4 max-w-lg font-serif text-3xl leading-tight text-charcoal md:text-4xl">
              Join the LifeMarked pilot
            </h2>
            <p className="reading-width mt-5 text-warm-grey">
              For memorial businesses interested in offering LifeMarked to their
              customers.
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
