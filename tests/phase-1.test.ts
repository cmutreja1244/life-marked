import { describe, expect, it } from "vitest";
import { denormalisedOwnerId, assertSingleOwnerAfterAccept } from "@/lib/platform/ownership";
import { registerSlug, canonicalSlug } from "@/lib/platform/routes";
import { publicMemorialOutcome, shouldIndex } from "@/lib/platform/visibility";
import { canPhysicallyPurge, transitionMedia, canPublishAsset } from "@/lib/platform/media-state";
import { incrementSubmissions, assertContributionAllowed } from "@/lib/platform/contributions";
import { abortIfUnreadyReferenced, buildPublishedSnapshot } from "@/lib/platform/snapshot";
import type { WorkingCopy } from "@/lib/platform/snapshot";
import { sanitiseTiptap, tiptapToParagraphs } from "@/lib/platform/tiptap";
import { qrPayload } from "@/lib/platform/qr";
import { isPublicToken } from "@/lib/platform/tokens";
import { canTransitionStatus } from "@/lib/platform/lifecycle";

describe("ownership", () => {
  it("keeps a single owner and denormalised owner_id", () => {
    const members = [
      { memorialId: "m1", userId: "u1", role: "owner" as const },
      { memorialId: "m1", userId: "u2", role: "editor" as const },
    ];
    expect(denormalisedOwnerId(members)).toBe("u1");
    expect(() =>
      denormalisedOwnerId([
        ...members,
        { memorialId: "m1", userId: "u3", role: "owner" },
      ]),
    ).toThrow(/only one owner/);
  });

  it("requires an owner once the memorial has been accepted", () => {
    expect(() => assertSingleOwnerAfterAccept([], "in_progress")).toThrow(/exactly one owner/);
    expect(() => assertSingleOwnerAfterAccept([], "draft")).not.toThrow();
  });
});

describe("slug registry", () => {
  it("never reassigns a slug to another memorial", () => {
    const routes = registerSlug([], "margaret-campbell", "m1");
    expect(canonicalSlug(routes, "m1")).toBe("margaret-campbell");
    expect(() => registerSlug(routes, "margaret-campbell", "m2")).toThrow(/permanently reserved/);
  });

  it("keeps the old slug when a display slug changes", () => {
    let routes = registerSlug([], "margaret-campbell", "m1");
    routes = registerSlug(routes, "margaret-eleanor", "m1");
    expect(canonicalSlug(routes, "m1")).toBe("margaret-eleanor");
    expect(routes.find((route) => route.slug === "margaret-campbell")?.memorialId).toBe("m1");
    expect(routes.find((route) => route.slug === "margaret-campbell")?.isCanonical).toBe(false);
  });
});

describe("private memorials", () => {
  it("returns the same not_found outcome as an unknown url", () => {
    expect(publicMemorialOutcome({ found: false, visibility: null, disabled: false, isMember: false })).toBe(
      "not_found",
    );
    expect(
      publicMemorialOutcome({ found: true, visibility: "private", disabled: false, isMember: false }),
    ).toBe("not_found");
  });

  it("does not index demos or unlisted memorials", () => {
    expect(shouldIndex("public", true, true)).toBe(false);
    expect(shouldIndex("unlisted", true, false)).toBe(false);
    expect(shouldIndex("public", true, false)).toBe(true);
  });
});

describe("media and snapshots", () => {
  it("blocks physical purge while a publication version still references the asset", () => {
    expect(
      canPhysicallyPurge({
        deletedAt: "2026-01-01",
        graceElapsed: true,
        snapshotReferenceCount: 1,
        workingCopyReferenceCount: 0,
      }),
    ).toBe(false);
  });

  it("does not publish assets that are not ready", () => {
    expect(canPublishAsset("processing")).toBe(false);
    expect(canPublishAsset("ready")).toBe(true);
    expect(transitionMedia("scanning", "quarantined")).toBe("quarantined");
    expect(() => transitionMedia("ready", "processing")).toThrow();
  });

  it("omits empty optional sections and pending memories", () => {
    const working: WorkingCopy = {
      memorialId: "m1",
      publicToken: "MARGCAMP01",
      slug: "margaret-campbell",
      isDemo: true,
      visibility: "unlisted",
      indexOptIn: true,
      firstName: "Margaret",
      fullName: "Margaret Eleanor Campbell",
      birth: { year: 1941 },
      death: { year: 2025 },
      openingLine: "Warmth",
      intro: "Intro",
      story: null,
      biography: ["A life."],
      pullQuote: "",
      closingHeading: "Close",
      closingText: "Thank you.",
      heroAssetId: "hero",
      heroImageAlt: "Portrait",
      heroFocalY: 18,
      storyImages: [{ assetId: "not-ready", alt: "x", caption: "x" }],
      timeline: [],
      gallery: [],
      memories: [
        { quote: "Pending", author: "A", status: "pending" },
        { quote: "Live", author: "B", status: "approved" },
      ],
      favouriteThings: [],
      voice: null,
      video: null,
      places: [],
      enabledSections: ["hero", "story", "timeline", "gallery", "favourites", "memories", "close"],
      media: [
        {
          id: "hero",
          kind: "image",
          status: "ready",
          publicUrl: "/images/margaret/portrait.webp",
          altText: "Portrait",
          caption: "",
          focalX: 50,
          focalY: 18,
          durationLabel: null,
          waveform: null,
        },
        {
          id: "not-ready",
          kind: "image",
          status: "processing",
          publicUrl: null,
          altText: "",
          caption: "",
          focalX: null,
          focalY: null,
          durationLabel: null,
          waveform: null,
        },
      ],
    };

    expect(() => abortIfUnreadyReferenced(working)).toThrow(/still being prepared/);
    working.storyImages = [];
    const snapshot = buildPublishedSnapshot(working);
    expect(snapshot.enabledSections).toEqual(["hero", "story", "memories", "close"]);
    expect(snapshot.memories).toEqual([{ quote: "Live", author: "B" }]);
    expect(snapshot.assetIds).toEqual(["hero"]);
    expect(snapshot.indexable).toBe(false);
  });
});

describe("contribution links", () => {
  const link = {
    tokenHash: "abc",
    expiresAt: "2099-01-01T00:00:00.000Z",
    revokedAt: null,
    reusable: true,
    maxSubmissions: 1,
    submissionCount: 0,
    allowedKinds: ["memory" as const],
  };

  it("enforces expiry, revoke, kind and remaining submissions", () => {
    expect(() => assertContributionAllowed({ ...link, revokedAt: "2026-01-01" }, "memory")).toThrow(/no longer active/);
    expect(() => incrementSubmissions({ ...link, submissionCount: 1 })).toThrow(/already been used/);
    expect(() => assertContributionAllowed(link, "photo")).toThrow(/not invited/);
    expect(incrementSubmissions(link).submissionCount).toBe(1);
  });
});

describe("content hygiene", () => {
  it("strips script nodes from Tiptap JSON", () => {
    const clean = sanitiseTiptap({
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Hello" }] },
        { type: "script", content: [{ type: "text", text: "alert(1)" }] },
      ],
    });
    expect(JSON.stringify(clean)).not.toContain("script");
    expect(tiptapToParagraphs(clean)).toEqual(["Hello"]);
  });

  it("encodes QR payloads as apex /q/{token}", () => {
    expect(qrPayload("MARGCAMP01")).toBe("https://lifemarked.co.uk/q/MARGCAMP01");
    expect(isPublicToken("MARGCAMP01")).toBe(true);
  });

  it("allows the published lifecycle", () => {
    expect(canTransitionStatus("in_progress", "in_review")).toBe(true);
    expect(canTransitionStatus("in_review", "published")).toBe(true);
    expect(canTransitionStatus("published", "disabled")).toBe(true);
  });
});
