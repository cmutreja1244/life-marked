export const MARGARET_HREF = "/m/margaret-campbell";
export const SITE_URL = "https://www.lifemarked.co.uk";

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
