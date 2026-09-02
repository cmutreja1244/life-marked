export const MARGARET_HREF = "/m/margaret-campbell";
import { CANONICAL_ORIGIN } from "@/lib/site";

export const SITE_URL = CANONICAL_ORIGIN;

export function sanitisePartnerName(
  value: string | string[] | undefined,
): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;

  const cleaned = raw
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

  return cleaned.length > 0 ? cleaned : null;
}
