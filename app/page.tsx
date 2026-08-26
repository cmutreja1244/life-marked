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
      </main>
      <Footer />
    </>
  );
}
