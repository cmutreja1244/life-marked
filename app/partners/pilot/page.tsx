import type { Metadata } from "next";
import { PilotCta } from "@/components/partners/PilotCta";
import { PilotEconomics } from "@/components/partners/PilotEconomics";
import { PilotFamily } from "@/components/partners/PilotFamily";
import { PilotFaq } from "@/components/partners/PilotFaq";
import { PilotFooter } from "@/components/partners/PilotFooter";
import { PilotHero } from "@/components/partners/PilotHero";
import { PilotMarker } from "@/components/partners/PilotMarker";
import { PilotModel } from "@/components/partners/PilotModel";
import { PilotPricing } from "@/components/partners/PilotPricing";
import { PilotProgramme } from "@/components/partners/PilotProgramme";
import { PilotTopBar } from "@/components/partners/PilotTopBar";
import { PilotWhy } from "@/components/partners/PilotWhy";
import { PilotWorkload } from "@/components/partners/PilotWorkload";
import { sanitisePartnerName } from "@/lib/pilot";

export const metadata: Metadata = {
  title: "LifeMarked Launch Partner Pilot",
  description:
    "Private overview of the LifeMarked launch partner programme for memorial businesses.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/partners/pilot" },
  openGraph: {
    title: "LifeMarked Launch Partner Pilot",
    description:
      "Private overview of the LifeMarked launch partner programme for memorial businesses.",
    url: "/partners/pilot",
  },
};

type PilotPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PilotPage({ searchParams }: PilotPageProps) {
  const params = await searchParams;
  const partnerName = sanitisePartnerName(params.partner);

  return (
    <div className="pilot-page min-h-screen bg-ivory text-charcoal">
      <PilotTopBar partnerName={partnerName} />
      <main>
        <PilotHero />
        <PilotFamily />
        <PilotModel />
        <PilotPricing />
        <PilotWorkload />
        <PilotEconomics />
        <PilotWhy />
        <PilotMarker />
        <PilotProgramme />
        <PilotFaq />
        <PilotCta />
      </main>
      <PilotFooter />
    </div>
  );
}
