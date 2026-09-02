import { qrUrl } from "@/lib/site";

export function qrPayload(publicToken: string): string {
  return qrUrl(publicToken);
}

export function quietZoneModules(): number {
  return 4;
}

export function errorCorrectionLevel(): "H" {
  return "H";
}
