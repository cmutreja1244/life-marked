export const ANALYTICS_EVENTS = {
  heroPartnerCta: "hero_partner_cta",
  navPartnerCta: "nav_partner_cta",
  seeHowItWorks: "see_how_it_works",
  demoOpened: "demo_opened",
  demoAudioClicked: "demo_audio_clicked",
  partnerSectionCta: "partner_section_cta",
  contactFormStarted: "contact_form_started",
  contactFormSubmitted: "contact_form_submitted",
  finalCtaClicked: "final_cta_clicked",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("lifemarked:analytics", { detail: { event } }),
  );
}
