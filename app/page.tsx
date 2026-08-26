import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ProblemStatement } from "@/components/ProblemStatement";
import { HowItWorks } from "@/components/HowItWorks";
import { PhysicalToDigital } from "@/components/PhysicalToDigital";
import { ProductPhilosophy } from "@/components/ProductPhilosophy";
import { MemorialLocations } from "@/components/MemorialLocations";
import { PhysicalProduct } from "@/components/PhysicalProduct";
import { DigitalExperience } from "@/components/DigitalExperience";
import { StoryCreation } from "@/components/StoryCreation";
import { Longevity } from "@/components/Longevity";
import { Partners } from "@/components/Partners";
import { PartnerWorkflow } from "@/components/PartnerWorkflow";
import { FinalCTA } from "@/components/FinalCTA";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ProblemStatement />
        <HowItWorks />
        <PhysicalToDigital />
        <ProductPhilosophy />
        <MemorialLocations />
        <PhysicalProduct />
        <DigitalExperience />
        <StoryCreation />
        <Longevity />
        <Partners />
        <PartnerWorkflow />
        <FinalCTA />
        <section id="contact" className="section-padding border-t border-border-warm">
          <div className="content-width mx-auto grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="section-label">Contact</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-charcoal">
                Start a conversation
              </h2>
              <p className="mt-6 max-w-sm text-warm-grey">
                If you&apos;re a memorial business interested in the LifeMarked
                pilot, we&apos;d like to hear from you.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
