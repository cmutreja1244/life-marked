"use client";

import { useEffect } from "react";
import { track, Analytics as VercelAnalytics } from "@vercel/analytics/react";
import type { AnalyticsEvent } from "@/lib/analytics";

export function AnalyticsProvider() {
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ event: AnalyticsEvent }>).detail;
      if (detail?.event) track(detail.event);
    };

    window.addEventListener("lifemarked:analytics", handler);
    return () => window.removeEventListener("lifemarked:analytics", handler);
  }, []);

  return <VercelAnalytics />;
}
