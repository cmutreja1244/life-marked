"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { store } from "@/lib/platform/store";
import { rateLimit } from "@/lib/rate-limit";

export async function submitPublicContribution(token: string, formData: FormData) {
  const ip = (await headers()).get("x-forwarded-for") ?? "local";
  const limited = await rateLimit("contribution", ip, 10, 10 * 60 * 1000);
  if (!limited.success) throw new Error("Please wait before sending another memory.");
  const link = await store.getContributionLink(token);
  if (!link) throw new Error("This invitation is no longer active.");
  store.submitContribution(
    link,
    "memory",
    { quote: String(formData.get("quote") ?? "") },
    String(formData.get("name") ?? "A friend"),
    String(formData.get("email") ?? "") || null,
  );
  redirect(`/c/${token}?sent=1`);
}
