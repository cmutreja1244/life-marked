function base32ToBytes(input: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = input.replace(/=+$/, "").toUpperCase().replace(/[\s-]/g, "");
  let bits = "";
  for (const char of cleaned) {
    const value = alphabet.indexOf(char);
    if (value < 0) continue;
    bits += value.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

function dynamicTruncate(hmac: Uint8Array) {
  const offset = hmac[hmac.length - 1]! & 0xf;
  const binary =
    ((hmac[offset]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff);
  return binary % 1_000_000;
}

export async function generateTotp(secret: string, at = Date.now(), stepSeconds = 30): Promise<string> {
  const counter = Math.floor(at / 1000 / stepSeconds);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(4, counter);
  const key = await crypto.subtle.importKey(
    "raw",
    base32ToBytes(secret) as BufferSource,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, buffer));
  return String(dynamicTruncate(mac)).padStart(6, "0");
}

export async function verifyTotp(secret: string, code: string, at = Date.now()) {
  const windows = [0, -1, 1];
  for (const offset of windows) {
    const candidate = await generateTotp(secret, at + offset * 30_000);
    if (candidate === code) return true;
  }
  return false;
}

export function newTotpSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let output = "";
  for (const byte of bytes) output += alphabet[byte % 32];
  return output;
}
