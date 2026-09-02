import { describe, expect, it } from "vitest";
import { CANONICAL_HOST, CANONICAL_ORIGIN, isWwwHost, qrUrl } from "@/lib/site";
import { rateLimit } from "@/lib/rate-limit";
import nextConfig from "@/next.config";

describe("canonical host", () => {
  it("uses lifemarked.co.uk as the QR origin", () => {
    expect(CANONICAL_HOST).toBe("lifemarked.co.uk");
    expect(CANONICAL_ORIGIN).toBe("https://lifemarked.co.uk");
    expect(qrUrl("abc123")).toBe("https://lifemarked.co.uk/q/abc123");
  });

  it("detects the www host for 301 redirects", () => {
    expect(isWwwHost("www.lifemarked.co.uk")).toBe(true);
    expect(isWwwHost("www.lifemarked.co.uk:443")).toBe(true);
    expect(isWwwHost("lifemarked.co.uk")).toBe(false);
  });
});

describe("contact rate limit", () => {
  it("allows a burst then returns 429-equivalent failure", async () => {
    const id = `test-${Math.random()}`;
    const first = await rateLimit("contact-test", id, 2, 60_000);
    const second = await rateLimit("contact-test", id, 2, 60_000);
    const third = await rateLimit("contact-test", id, 2, 60_000);

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(third.success).toBe(false);
  });
});

describe("security headers", () => {
  it("sets HSTS, CSP and frame denial", async () => {
    const headers = await nextConfig.headers?.();
    const values = headers?.[0]?.headers ?? [];
    const byKey = Object.fromEntries(values.map((header) => [header.key, header.value]));
    expect(byKey["X-Frame-Options"]).toBe("DENY");
    expect(byKey["X-Content-Type-Options"]).toBe("nosniff");
    expect(byKey["Strict-Transport-Security"]).toContain("max-age=");
    expect(byKey["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
  });
});
