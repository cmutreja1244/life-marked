const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "lifemarked_utm";

export function captureUtmFromUrl(): UtmParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }

  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  }

  return utm;
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}
