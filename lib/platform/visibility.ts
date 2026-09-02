import type { Visibility } from "./enums";

export type PublicLookup = {
  found: boolean;
  visibility: Visibility | null;
  disabled: boolean;
  isMember: boolean;
};

export type PublicOutcome = "not_found" | "unavailable" | "ok";

export function publicMemorialOutcome(lookup: PublicLookup): PublicOutcome {
  if (!lookup.found) return "not_found";
  if (lookup.visibility === "private" && !lookup.isMember) return "not_found";
  if (lookup.disabled && lookup.visibility !== "private") return "unavailable";
  if (lookup.disabled && lookup.visibility === "private" && lookup.isMember) return "unavailable";
  return "ok";
}

export function shouldIndex(visibility: Visibility, indexOptIn: boolean, isDemo: boolean) {
  if (isDemo) return false;
  return visibility === "public" && indexOptIn;
}
