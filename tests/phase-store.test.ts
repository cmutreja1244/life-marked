import { describe, expect, it } from "vitest";
import { PlatformRepository } from "@/lib/platform/store";
import { detectThreat } from "@/lib/media/pipeline";

describe("admin create and invite", () => {
  it("records a memorial and an owner invitation", async () => {
    const repo = new PlatformRepository();
    const created = repo.createMemorial({
      fullName: "James Campbell",
      slug: "james-campbell",
      actorId: "admin-1",
    });
    const invite = await repo.inviteOwner(created.id, "anna@example.com", "admin-1");
    expect(created.publicToken).toHaveLength(10);
    expect(repo.getMemorial(created.id)?.status).toBe("owner_invited");
    expect(invite.rawToken).toBeTruthy();
    expect(repo.audit.some((event) => event.action === "invite.owner")).toBe(true);
  });
});

describe("publishing media retention", () => {
  it("keeps snapshot media after the working copy removes a photo", () => {
    const repo = new PlatformRepository();
    const margaret = [...repo.memorials.values()][0]!;
    const before = repo.versions.find((version) => version.id === margaret.publishedVersionId)!;
    const content = repo.content.get(margaret.id)!;
    content.gallery = [];
    const live = repo.lookupPublic({ slug: "margaret-campbell" });
    expect(live.outcome).toBe("ok");
    if (live.outcome === "ok") {
      expect(live.snapshot.gallery.length).toBeGreaterThan(0);
      expect(before.assetIds.length).toBeGreaterThan(0);
    }
  });

  it("blocks purge while a publication version references the asset", () => {
    const repo = new PlatformRepository();
    expect(() => repo.purgeAsset("hero")).toThrow(/publication version/);
  });

  it("retains original bytes after public playback is removed", () => {
    const repo = new PlatformRepository();
    const memorial = repo.createMemorial({ fullName: "Test", slug: "original-bytes-test", actorId: null });
    const bytes = new Uint8Array([1, 2, 3, 4]);
    const asset = repo.createAsset({
      memorialId: memorial.id,
      kind: "video",
      mime: "video/mp4",
      filename: "clip.mp4",
      bytes,
    });
    repo.setAssetStatus(asset.id, "uploaded");
    repo.setAssetStatus(asset.id, "scanning");
    repo.setAssetStatus(asset.id, "processing");
    repo.setAssetStatus(asset.id, "ready", { publicUrl: `/api/media/${asset.id}` });
    asset.publicUrl = null;
    expect(repo.media.get(asset.id)?.publicUrl).toBeNull();
    expect(repo.originals.get(asset.originalKey!)).toEqual(bytes);
  });
});

describe("contribution links", () => {
  it("rejects a second submission when max is 1", async () => {
    const repo = new PlatformRepository();
    const memorial = repo.createMemorial({ fullName: "Test", slug: "contrib-cap", actorId: null });
    const link = await repo.createContributionLink(memorial.id, {
      allowedKinds: ["memory"],
      maxSubmissions: 1,
      expiresAt: "2099-01-01T00:00:00.000Z",
    });
    repo.submitContribution(link, "memory", { quote: "Hello" }, "Sam", null);
    expect(() => repo.submitContribution(link, "memory", { quote: "Again" }, "Sam", null)).toThrow(/already been used/);
  });
});

describe("clamav stub", () => {
  it("never copies EICAR to public URLs", () => {
    const threat = detectThreat(Buffer.from("X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"));
    expect(threat.status).toBe("quarantined");
  });
});
