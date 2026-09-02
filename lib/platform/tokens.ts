import { customAlphabet } from "nanoid";

/** Crockford base32 without I, L, O, U. */
export const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const tokenAlphabet = customAlphabet(CROCKFORD, 10);
const inviteAlphabet = customAlphabet(`${CROCKFORD}${CROCKFORD.toLowerCase()}`, 26);

export function generatePublicToken(): string {
  return tokenAlphabet();
}

export function isPublicToken(value: string): boolean {
  return /^[0-9A-HJKMNP-TV-Z]{10}$/i.test(value);
}

export function generateInviteToken(): string {
  return inviteAlphabet();
}

export async function sha256(input: string): Promise<string> {
  if (typeof globalThis.crypto?.subtle?.digest === "function") {
    const bytes = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return fallbackHash(input);
}

function fallbackHash(input: string): string {
  let h1 = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h1 ^= input.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193);
  }
  return (h1 >>> 0).toString(16).padStart(8, "0").repeat(8).slice(0, 64);
}
