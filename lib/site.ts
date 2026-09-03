export const CANONICAL_HOST = "lifemarked.co.uk";
export const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
export const WWW_HOST = "www.lifemarked.co.uk";
export const PUBLIC_ORIGIN = `https://${WWW_HOST}`;
export const EMAIL_LOGO_SRC = `${PUBLIC_ORIGIN}/Logo_Wide_NoBG.png`;

export function isWwwHost(host: string | null): boolean {
  if (!host) return false;
  return host.split(":")[0]?.toLowerCase() === WWW_HOST;
}

export function canonicalUrl(pathname = "/"): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${CANONICAL_ORIGIN}${path}`;
}

export function qrUrl(publicToken: string): string {
  return canonicalUrl(`/q/${publicToken}`);
}

export function memorialUrl(slug: string): string {
  return canonicalUrl(`/m/${slug}`);
}
