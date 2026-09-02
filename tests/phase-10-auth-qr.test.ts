import { describe, expect, it } from "vitest";
import { qrPayload } from "@/lib/platform/qr";
import { PlatformRepository } from "@/lib/platform/store";
import { generateTotp, verifyTotp } from "@/lib/auth/totp";

describe("QR durability", () => {
  it("does not change the QR payload when the human slug changes", () => {
    const repo = new PlatformRepository();
    const memorial = repo.createMemorial({ fullName: "James", slug: "james-first", actorId: null });
    const before = qrPayload(memorial.publicToken);
    repo.changeSlug(memorial.id, "james-second");
    expect(qrPayload(repo.getMemorial(memorial.id)!.publicToken)).toBe(before);
    expect(before).toBe(`https://lifemarked.co.uk/q/${memorial.publicToken}`);
    expect(repo.routes.find((route) => route.slug === "james-first")?.memorialId).toBe(memorial.id);
  });
});

describe("admin MFA", () => {
  it("accepts a valid TOTP and rejects a wrong code", async () => {
    const secret = "JBSWY3DPEHPK3PXP";
    const code = await generateTotp(secret);
    expect(await verifyTotp(secret, code)).toBe(true);
    expect(await verifyTotp(secret, "000000")).toBe(false);
  });
});
