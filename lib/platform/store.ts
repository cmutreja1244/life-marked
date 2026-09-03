import { margaretCampbell } from "@/data/memorials/margaret-campbell";
import { assertContributionAllowed } from "./contributions";
import type { MediaStatus, MemberRole, Visibility } from "./enums";
import { canTransitionStatus } from "./lifecycle";
import { canPhysicallyPurge, transitionMedia } from "./media-state";
import { registerSlug, resolveRoute, type MemorialRoute } from "./routes";
import { abortIfUnreadyReferenced, buildPublishedSnapshot, type WorkingCopy } from "./snapshot";
import { generateInviteToken, generatePublicToken, sha256 } from "./tokens";
import type {
  ContributionLinkRecord,
  ContributionRecord,
  Invitation,
  MediaAssetRecord,
  MemorialContent,
  MemorialRecord,
  Profile,
  PublicationVersion,
} from "./types";
import { defaultSections } from "./types";
import { denormalisedOwnerId } from "./ownership";
import { publicMemorialOutcome, type PublicOutcome } from "./visibility";

export type Member = { memorialId: string; userId: string; role: MemberRole };

export type PublicLookup =
  | { outcome: "not_found" }
  | { outcome: "unavailable"; memorialId: string }
  | {
      outcome: "ok";
      snapshot: import("./snapshot").PublishedSnapshot;
      canonicalSlug: string;
      requestedSlug: string | null;
      publicToken: string;
      isDemo: boolean;
      visibility: Visibility;
      indexable: boolean;
    };

type Partner = { id: string; name: string };
type Package = { id: string; name: string; publishingMode: "admin_review" | "self_publish" };
type Note = { id: string; memorialId: string; authorId: string | null; body: string; createdAt: string };
type Audit = { id: string; actorId: string | null; memorialId: string | null; action: string; payload: Record<string, unknown>; createdAt: string };
type Report = { id: string; memorialId: string | null; publicToken: string | null; body: string; reporterEmail: string | null; status: string; createdAt: string };
type ExportJob = { id: string; memorialId: string; requestedBy: string | null; status: string; downloadPath: string | null };

const MARGARET_ID = "00000000-0000-4000-8000-000000000010";
export const MARGARET_TOKEN = "MARGCAMP01";
export const MARGARET_SLUG = "margaret-campbell";
const PILOT_PACKAGE_ID = "00000000-0000-4000-8000-000000000001";

function randomUUID() {
  return globalThis.crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

class PlatformRepository {
  profiles = new Map<string, Profile>();
  partners = new Map<string, Partner>();
  packages = new Map<string, Package>();
  memorials = new Map<string, MemorialRecord>();
  members: Member[] = [];
  routes: MemorialRoute[] = [];
  invitations: Invitation[] = [];
  contributionLinks: ContributionLinkRecord[] = [];
  contributions: ContributionRecord[] = [];
  content = new Map<string, MemorialContent>();
  media = new Map<string, MediaAssetRecord>();
  versions: PublicationVersion[] = [];
  notes: Note[] = [];
  audit: Audit[] = [];
  reports: Report[] = [];
  exportJobs: ExportJob[] = [];
  otp = new Map<string, { code: string; expiresAt: number }>();
  originals = new Map<string, Uint8Array>();

  constructor() {
    this.seed();
  }

  private seed() {
    this.packages.set(PILOT_PACKAGE_ID, { id: PILOT_PACKAGE_ID, name: "Pilot", publishingMode: "admin_review" });
    this.partners.set("partner-demo", { id: "partner-demo", name: "LifeMarked Pilot Partner" });

    const ready = (id: string, url: string, alt: string): MediaAssetRecord => ({
      id,
      memorialId: MARGARET_ID,
      kind: "image",
      status: "ready",
      originalKey: `memorials-originals/${MARGARET_ID}/${id}`,
      originalBytes: null,
      publicUrl: url,
      mime: "image/webp",
      sha256: id,
      altText: alt,
      caption: "",
      focalX: 50,
      focalY: 18,
      durationLabel: null,
      waveform: null,
      quarantineReason: null,
      createdAt: nowIso(),
      deletedAt: null,
    });

    const images = [
      ready("hero", margaretCampbell.heroImage ?? "/images/margaret/portrait.webp", margaretCampbell.heroImageAlt),
      ready("wedding", "/images/margaret/wedding.webp", "Margaret and James on their wedding day"),
      ready("candid", "/images/margaret/candid.webp", "Margaret gathering flowers in the garden"),
      ready("family", "/images/margaret/family-1.webp", "Margaret with family on a garden bench"),
      ready("florist", "/images/margaret/florist.webp", "Campbell Florists in Edinburgh"),
      ready("travel", "/images/margaret/travel.webp", "Margaret looking out over the countryside near Florence"),
    ];
    images.forEach((asset) => this.media.set(asset.id, asset));

    const memorial: MemorialRecord = {
      id: MARGARET_ID,
      publicToken: MARGARET_TOKEN,
      ownerId: null,
      partnerId: "partner-demo",
      packageId: PILOT_PACKAGE_ID,
      firstName: margaretCampbell.firstName,
      fullName: margaretCampbell.fullName,
      birth: { year: margaretCampbell.birthYear },
      death: { year: margaretCampbell.deathYear },
      openingLine: margaretCampbell.openingLine,
      intro: margaretCampbell.intro,
      closingHeading: margaretCampbell.closingHeading,
      closingText: margaretCampbell.closingText,
      pullQuote: margaretCampbell.pullQuote,
      heroAssetId: "hero",
      heroImageAlt: margaretCampbell.heroImageAlt,
      heroFocalY: 18,
      status: "published",
      visibility: "unlisted",
      publishingMode: "admin_review",
      indexOptIn: false,
      isDemo: true,
      publishedVersionId: null,
      publishedAt: nowIso(),
      markerStatus: "engraved",
      scanCount: 0,
      lastScannedAt: null,
      disabledAt: null,
      disabledReason: null,
      deletedAt: null,
      purgeAfter: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.memorials.set(memorial.id, memorial);
    this.routes = registerSlug(this.routes, MARGARET_SLUG, MARGARET_ID);

    this.content.set(MARGARET_ID, {
      story: null,
      biography: margaretCampbell.biography,
      timeline: margaretCampbell.timeline,
      gallery: margaretCampbell.gallery.map((item) => ({
        assetId:
          item.src.includes("family")
            ? "family"
            : item.src.includes("portrait")
              ? "hero"
              : item.src.includes("wedding")
                ? "wedding"
                : item.src.includes("florist")
                  ? "florist"
                  : item.src.includes("travel")
                    ? "travel"
                    : "candid",
        alt: item.alt,
        caption: item.caption,
        layout: item.layout,
      })),
      storyImages: margaretCampbell.storyImages.map((item) => ({
        assetId: item.src.includes("wedding") ? "wedding" : "candid",
        alt: item.alt,
        caption: item.caption,
      })),
      memories: margaretCampbell.memories.map((memory) => ({ ...memory, status: "approved" as const })),
      favouriteThings: margaretCampbell.favouriteThings,
      voice: {
        label: margaretCampbell.voiceMemory.label,
        title: margaretCampbell.voiceMemory.title,
        recorded: margaretCampbell.voiceMemory.recorded,
        supportingText: margaretCampbell.voiceMemory.supportingText,
        assetId: null,
        imageAssetId: "wedding",
        imageAlt: margaretCampbell.voiceMemory.imageAlt,
      },
      video: null,
      places: margaretCampbell.places.map((place) => ({
        heading: place.heading,
        location: place.location,
        text: place.text,
        assetId: "travel",
        imageAlt: place.imageAlt,
        caption: place.caption,
      })),
      sections: defaultSections(),
    });

    const snapshot = buildPublishedSnapshot(this.toWorkingCopy(MARGARET_ID));
    const version: PublicationVersion = {
      id: randomUUID(),
      memorialId: MARGARET_ID,
      versionNumber: 1,
      snapshot,
      createdBy: null,
      createdAt: nowIso(),
      trigger: "seed",
      assetIds: snapshot.assetIds,
    };
    this.versions.push(version);
    memorial.publishedVersionId = version.id;
  }

  listMemorials() {
    return [...this.memorials.values()].filter((row) => !row.deletedAt).map(clone);
  }

  getMemorial(id: string) {
    const row = this.memorials.get(id);
    return row ? clone(row) : null;
  }

  getByToken(token: string) {
    return [...this.memorials.values()].find((row) => row.publicToken === token && !row.deletedAt) ?? null;
  }

  membership(memorialId: string, userId: string | null) {
    if (!userId) return null;
    return this.members.find((member) => member.memorialId === memorialId && member.userId === userId) ?? null;
  }

  syncOwner(memorialId: string) {
    const memorial = this.memorials.get(memorialId);
    if (!memorial) return;
    memorial.ownerId = denormalisedOwnerId(this.members.filter((member) => member.memorialId === memorialId));
  }

  createMemorial(input: {
    fullName: string;
    firstName?: string;
    slug: string;
    actorId: string | null;
    publishingMode?: "admin_review" | "self_publish";
    partnerId?: string | null;
  }) {
    const id = randomUUID();
    const record: MemorialRecord = {
      id,
      publicToken: generatePublicToken(),
      ownerId: null,
      partnerId: input.partnerId ?? null,
      packageId: PILOT_PACKAGE_ID,
      firstName: input.firstName ?? input.fullName.split(" ")[0] ?? "",
      fullName: input.fullName,
      birth: {},
      death: {},
      openingLine: "",
      intro: "",
      closingHeading: "",
      closingText: "",
      pullQuote: "",
      heroAssetId: null,
      heroImageAlt: "",
      heroFocalY: 18,
      status: "draft",
      visibility: "unlisted",
      publishingMode: input.publishingMode ?? "admin_review",
      indexOptIn: false,
      isDemo: false,
      publishedVersionId: null,
      publishedAt: null,
      markerStatus: "unassigned",
      scanCount: 0,
      lastScannedAt: null,
      disabledAt: null,
      disabledReason: null,
      deletedAt: null,
      purgeAfter: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.routes = registerSlug(this.routes, input.slug, id);
    this.memorials.set(id, record);
    this.content.set(id, {
      story: null,
      biography: [],
      timeline: [],
      gallery: [],
      storyImages: [],
      memories: [],
      favouriteThings: [],
      voice: null,
      video: null,
      places: [],
      sections: defaultSections(),
    });
    this.recordAudit(input.actorId, id, "memorial.created", { slug: input.slug });
    return clone(record);
  }

  async inviteOwner(memorialId: string, email: string, actorId: string | null) {
    const memorial = this.memorials.get(memorialId);
    if (!memorial) throw new Error("Memorial not found.");
    const rawToken = generateInviteToken();
    const invitation: Invitation = {
      id: randomUUID(),
      memorialId,
      email: email.toLowerCase(),
      kind: "owner",
      collaboratorRole: null,
      tokenHash: await sha256(rawToken),
      rawToken,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      acceptedAt: null,
      revokedAt: null,
      sentAt: null,
    };
    this.invitations.push(invitation);
    memorial.status = "owner_invited";
    memorial.updatedAt = nowIso();
    this.recordAudit(actorId, memorialId, "invite.owner", { email });
    return { ...invitation };
  }

  async inviteCollaborator(
    memorialId: string,
    email: string,
    role: Exclude<MemberRole, "owner">,
    actorId: string | null,
  ) {
    const rawToken = generateInviteToken();
    const invitation: Invitation = {
      id: randomUUID(),
      memorialId,
      email: email.toLowerCase(),
      kind: "collaborator",
      collaboratorRole: role,
      tokenHash: await sha256(rawToken),
      rawToken,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      acceptedAt: null,
      revokedAt: null,
      sentAt: null,
    };
    this.invitations.push(invitation);
    this.recordAudit(actorId, memorialId, "invite.collaborator", { email, role });
    return invitation;
  }

  async acceptInvite(rawToken: string, user: Profile) {
    const hash = await sha256(rawToken);
    const invitation = this.invitations.find((row) => row.tokenHash === hash);
    if (!invitation || invitation.revokedAt || invitation.acceptedAt) {
      throw new Error("This invitation is no longer valid.");
    }
    if (new Date(invitation.expiresAt).getTime() < Date.now()) {
      throw new Error("This invitation has expired.");
    }
    this.upsertProfile(user);
    const role: MemberRole = invitation.kind === "owner" ? "owner" : (invitation.collaboratorRole ?? "editor");
    if (role === "owner" && this.members.some((member) => member.memorialId === invitation.memorialId && member.role === "owner")) {
      throw new Error("This memorial already has an owner.");
    }
    this.members.push({ memorialId: invitation.memorialId, userId: user.id, role });
    this.syncOwner(invitation.memorialId);
    invitation.acceptedAt = nowIso();
    const memorial = this.memorials.get(invitation.memorialId);
    if (memorial && invitation.kind === "owner") {
      memorial.status = "in_progress";
      memorial.updatedAt = nowIso();
    }
    return invitation.memorialId;
  }

  markInviteSent(invitationId: string) {
    const invitation = this.invitations.find((row) => row.id === invitationId);
    if (!invitation) throw new Error("Invite not found.");
    invitation.sentAt = nowIso();
    return invitation;
  }

  revokeInvitation(invitationId: string) {
    const invitation = this.invitations.find((row) => row.id === invitationId);
    if (!invitation) throw new Error("Invite not found.");
    if (invitation.acceptedAt) throw new Error("This invite has already been used.");
    invitation.revokedAt = nowIso();
    invitation.rawToken = undefined;
    this.recordAudit(null, invitation.memorialId, "invite.revoked", { invitationId });
    return invitation;
  }

  async renewInvitation(invitationId: string, actorId: string | null) {
    const invitation = this.invitations.find((row) => row.id === invitationId);
    if (!invitation) throw new Error("Invite not found.");
    if (invitation.acceptedAt) throw new Error("This invite has already been used.");
    const rawToken = generateInviteToken();
    invitation.tokenHash = await sha256(rawToken);
    invitation.rawToken = rawToken;
    invitation.revokedAt = null;
    invitation.expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    this.recordAudit(actorId, invitation.memorialId, "invite.renewed", { invitationId });
    return { ...invitation, rawToken };
  }

  upsertProfile(profile: Profile) {
    this.profiles.set(profile.id, clone(profile));
  }

  getProfileByEmail(email: string) {
    return [...this.profiles.values()].find((row) => row.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  memorialsForUser(userId: string) {
    const ids = this.members.filter((member) => member.userId === userId).map((member) => member.memorialId);
    return ids.map((id) => this.memorials.get(id)!).filter(Boolean).map(clone);
  }

  updateMemorial(id: string, patch: Partial<MemorialRecord>) {
    const memorial = this.memorials.get(id);
    if (!memorial) throw new Error("Memorial not found.");
    Object.assign(memorial, patch, { updatedAt: nowIso() });
    return clone(memorial);
  }

  updateContent(id: string, patch: Partial<MemorialContent>) {
    const content = this.content.get(id);
    if (!content) throw new Error("Memorial not found.");
    Object.assign(content, patch);
    const memorial = this.memorials.get(id);
    if (memorial) memorial.updatedAt = nowIso();
  }

  toWorkingCopy(id: string): WorkingCopy {
    const memorial = this.memorials.get(id);
    const content = this.content.get(id);
    if (!memorial || !content) throw new Error("Memorial not found.");
    const canonical = this.routes.find((route) => route.memorialId === id && route.isCanonical)?.slug ?? "";
    return {
      memorialId: id,
      publicToken: memorial.publicToken,
      slug: canonical,
      isDemo: memorial.isDemo,
      visibility: memorial.visibility,
      indexOptIn: memorial.indexOptIn,
      firstName: memorial.firstName,
      fullName: memorial.fullName,
      birth: memorial.birth,
      death: memorial.death,
      openingLine: memorial.openingLine,
      intro: memorial.intro,
      story: content.story,
      biography: content.biography,
      pullQuote: memorial.pullQuote,
      closingHeading: memorial.closingHeading,
      closingText: memorial.closingText,
      heroAssetId: memorial.heroAssetId,
      heroImageAlt: memorial.heroImageAlt,
      heroFocalY: memorial.heroFocalY,
      storyImages: content.storyImages,
      timeline: content.timeline,
      gallery: content.gallery,
      memories: content.memories,
      favouriteThings: content.favouriteThings,
      voice: content.voice,
      video: content.video,
      places: content.places,
      enabledSections: content.sections.filter((section) => section.enabled).map((section) => section.key),
      media: [...this.media.values()]
        .filter((asset) => asset.memorialId === id)
        .map((asset) => ({
          id: asset.id,
          kind: asset.kind,
          status: asset.status,
          publicUrl: asset.publicUrl,
          altText: asset.altText,
          caption: asset.caption,
          focalX: asset.focalX,
          focalY: asset.focalY,
          durationLabel: asset.durationLabel,
          waveform: asset.waveform,
        })),
    };
  }

  previewSnapshot(id: string) {
    return buildPublishedSnapshot(this.toWorkingCopy(id));
  }

  publish(id: string, actorId: string | null, trigger: string) {
    const memorial = this.memorials.get(id);
    if (!memorial) throw new Error("Memorial not found.");
    const working = this.toWorkingCopy(id);
    abortIfUnreadyReferenced(working);
    const snapshot = buildPublishedSnapshot(working);
    const versionNumber = this.versions.filter((row) => row.memorialId === id).length + 1;
    const version: PublicationVersion = {
      id: randomUUID(),
      memorialId: id,
      versionNumber,
      snapshot,
      createdBy: actorId,
      createdAt: nowIso(),
      trigger,
      assetIds: snapshot.assetIds,
    };
    this.versions.push(version);
    memorial.publishedVersionId = version.id;
    memorial.publishedAt = nowIso();
    memorial.status = "published";
    memorial.updatedAt = nowIso();
    this.recordAudit(actorId, id, "memorial.published", { versionNumber, trigger });
    return version;
  }

  submitForReview(id: string, actorId: string | null) {
    const memorial = this.memorials.get(id);
    if (!memorial) throw new Error("Memorial not found.");
    if (memorial.publishingMode === "self_publish") {
      return this.publish(id, actorId, "self_publish");
    }
    if (!canTransitionStatus(memorial.status, "in_review") && memorial.status !== "published") {
      throw new Error("This memorial cannot be submitted yet.");
    }
    memorial.status = "in_review";
    memorial.updatedAt = nowIso();
    this.recordAudit(actorId, id, "memorial.submitted", {});
    return memorial;
  }

  requestChanges(id: string, actorId: string | null, note: string) {
    const memorial = this.memorials.get(id);
    if (!memorial) throw new Error("Memorial not found.");
    memorial.status = "changes_requested";
    memorial.updatedAt = nowIso();
    this.notes.push({ id: randomUUID(), memorialId: id, authorId: actorId, body: note, createdAt: nowIso() });
    this.recordAudit(actorId, id, "memorial.changes_requested", {});
  }

  rollback(id: string, versionId: string, actorId: string | null) {
    const version = this.versions.find((row) => row.id === versionId && row.memorialId === id);
    if (!version) throw new Error("Version not found.");
    const missing = version.assetIds.filter((assetId) => {
      const asset = this.media.get(assetId);
      return !asset || (!asset.originalKey && !asset.publicUrl);
    });
    if (missing.length) throw new Error("Cannot roll back because original media is missing.");
    const memorial = this.memorials.get(id)!;
    memorial.publishedVersionId = version.id;
    memorial.status = "published";
    memorial.updatedAt = nowIso();
    this.recordAudit(actorId, id, "memorial.rollback", { versionId });
  }

  changeSlug(id: string, slug: string) {
    this.routes = registerSlug(this.routes, slug, id);
    const memorial = this.memorials.get(id);
    if (memorial) memorial.updatedAt = nowIso();
  }

  incrementScan(token: string) {
    const memorial = this.getByToken(token);
    if (!memorial) return;
    memorial.scanCount += 1;
    memorial.lastScannedAt = nowIso();
  }

  lookupPublic(opts: { slug?: string; token?: string; userId?: string | null }): PublicLookup {
    let memorial: MemorialRecord | undefined;
    const requestedSlug: string | null = opts.slug ?? null;
    if (opts.token) {
      memorial = this.getByToken(opts.token) ?? undefined;
    } else if (opts.slug) {
      const route = resolveRoute(this.routes, opts.slug);
      if (!route) return { outcome: "not_found" };
      memorial = this.memorials.get(route.memorialId);
    }
    if (!memorial || memorial.deletedAt) return { outcome: "not_found" };

    const isMember = Boolean(this.membership(memorial.id, opts.userId ?? null)) || Boolean(this.profiles.get(opts.userId ?? "")?.isAdmin);
    const outcome: PublicOutcome = publicMemorialOutcome({
      found: true,
      visibility: memorial.visibility,
      disabled: Boolean(memorial.disabledAt) || memorial.status === "archived" || memorial.status === "disabled",
      isMember,
    });
    if (outcome === "not_found") return { outcome: "not_found" };
    if (outcome === "unavailable") return { outcome: "unavailable", memorialId: memorial.id };
    if (memorial.status !== "published" || !memorial.publishedVersionId) return { outcome: "not_found" };

    const version = this.versions.find((row) => row.id === memorial.publishedVersionId);
    if (!version) return { outcome: "not_found" };
    const canonicalSlug = this.routes.find((route) => route.memorialId === memorial.id && route.isCanonical)?.slug ?? "";
    return {
      outcome: "ok",
      snapshot: version.snapshot,
      canonicalSlug,
      requestedSlug,
      publicToken: memorial.publicToken,
      isDemo: memorial.isDemo,
      visibility: memorial.visibility,
      indexable: memorial.visibility === "public" && memorial.indexOptIn && !memorial.isDemo,
    };
  }

  createAsset(input: {
    memorialId: string;
    kind: MediaAssetRecord["kind"];
    mime: string;
    filename: string;
    bytes?: Uint8Array;
    publicUrl?: string;
  }) {
    const id = randomUUID();
    const asset: MediaAssetRecord = {
      id,
      memorialId: input.memorialId,
      kind: input.kind,
      status: "awaiting_upload",
      originalKey: `quarantine/${input.memorialId}/${id}`,
      originalBytes: input.bytes ?? null,
      publicUrl: input.publicUrl ?? null,
      mime: input.mime,
      sha256: null,
      altText: "",
      caption: "",
      focalX: 50,
      focalY: 50,
      durationLabel: null,
      waveform: null,
      quarantineReason: null,
      createdAt: nowIso(),
      deletedAt: null,
    };
    this.media.set(id, asset);
    if (input.bytes) this.originals.set(asset.originalKey!, input.bytes);
    return asset;
  }

  setAssetStatus(id: string, status: MediaStatus, extra: Partial<MediaAssetRecord> = {}) {
    const asset = this.media.get(id);
    if (!asset) throw new Error("Asset not found.");
    asset.status = transitionMedia(asset.status, status);
    Object.assign(asset, extra);
    return asset;
  }

  softDeleteAsset(id: string) {
    const asset = this.media.get(id);
    if (!asset) return;
    asset.status = transitionMedia(asset.status === "deleted" ? "deleted" : asset.status, "deleted");
    asset.deletedAt = nowIso();
  }

  purgeAsset(id: string) {
    const asset = this.media.get(id);
    if (!asset) return;
    const snapshotReferenceCount = this.versions.filter((version) => version.assetIds.includes(id)).length;
    const working = this.content.get(asset.memorialId);
    const workingCopyReferenceCount = working
      ? [
          ...(working.gallery.map((item) => item.assetId) ?? []),
          ...(working.storyImages.map((item) => item.assetId) ?? []),
        ].filter((assetId) => assetId === id).length
      : 0;
    if (
      !canPhysicallyPurge({
        deletedAt: asset.deletedAt,
        graceElapsed: true,
        snapshotReferenceCount,
        workingCopyReferenceCount,
      })
    ) {
      throw new Error("Cannot physically purge an asset referenced by a publication version.");
    }
    if (asset.originalKey) this.originals.delete(asset.originalKey);
    asset.originalKey = null;
    asset.originalBytes = null;
    asset.publicUrl = null;
  }

  async createContributionLink(
    memorialId: string,
    input: Partial<ContributionLinkRecord> & Pick<ContributionLinkRecord, "allowedKinds" | "maxSubmissions" | "expiresAt">,
  ) {
    const rawToken = generateInviteToken();
    const link: ContributionLinkRecord = {
      id: randomUUID(),
      memorialId,
      tokenHash: await sha256(rawToken),
      rawToken,
      expiresAt: input.expiresAt,
      revokedAt: null,
      reusable: input.reusable ?? true,
      maxSubmissions: input.maxSubmissions,
      submissionCount: 0,
      allowedKinds: input.allowedKinds,
      requireEmail: input.requireEmail ?? false,
    };
    this.contributionLinks.push(link);
    return link;
  }

  async getContributionLink(rawToken: string) {
    const hash = await sha256(rawToken);
    return this.contributionLinks.find((link) => link.tokenHash === hash) ?? null;
  }

  submitContribution(link: ContributionLinkRecord, kind: ContributionLinkRecord["allowedKinds"][number], payload: Record<string, unknown>, name: string, email: string | null) {
    assertContributionAllowed(link, kind);
    link.submissionCount += 1;
    const row: ContributionRecord = {
      id: randomUUID(),
      memorialId: link.memorialId,
      contributionLinkId: link.id,
      kind,
      payload,
      status: "pending",
      submitterName: name,
      submitterEmail: email,
    };
    this.contributions.push(row);
    return row;
  }

  approveContribution(id: string) {
    const row = this.contributions.find((item) => item.id === id);
    if (!row) throw new Error("Contribution not found.");
    row.status = "approved";
    const content = this.content.get(row.memorialId);
    if (content && row.kind === "memory") {
      content.memories.push({
        quote: String(row.payload.quote ?? ""),
        author: row.submitterName,
        status: "approved",
      });
    }
  }

  createReport(body: string, publicToken: string | null, email: string | null) {
    const memorial = publicToken ? this.getByToken(publicToken) : null;
    const report: Report = {
      id: randomUUID(),
      memorialId: memorial?.id ?? null,
      publicToken,
      body,
      reporterEmail: email,
      status: "open",
      createdAt: nowIso(),
    };
    this.reports.push(report);
    return report;
  }

  scheduleDelete(id: string, actorId: string | null) {
    const memorial = this.memorials.get(id);
    if (!memorial) throw new Error("Memorial not found.");
    memorial.deletedAt = nowIso();
    memorial.purgeAfter = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    this.recordAudit(actorId, id, "memorial.deleted", {});
  }

  restoreMemorial(id: string, actorId: string | null) {
    const memorial = this.memorials.get(id);
    if (!memorial) throw new Error("Memorial not found.");
    memorial.deletedAt = null;
    memorial.purgeAfter = null;
    this.recordAudit(actorId, id, "memorial.restored", {});
  }

  disable(id: string, reason: string, actorId: string | null) {
    const memorial = this.memorials.get(id);
    if (!memorial) throw new Error("Memorial not found.");
    memorial.disabledAt = nowIso();
    memorial.disabledReason = reason;
    memorial.status = "disabled";
    this.recordAudit(actorId, id, "memorial.disabled", { reason });
  }

  enable(id: string, actorId: string | null) {
    const memorial = this.memorials.get(id);
    if (!memorial) throw new Error("Memorial not found.");
    memorial.disabledAt = null;
    memorial.disabledReason = null;
    memorial.status = "published";
    this.recordAudit(actorId, id, "memorial.enabled", {});
  }

  recordAudit(actorId: string | null, memorialId: string | null, action: string, payload: Record<string, unknown>) {
    this.audit.push({
      id: randomUUID(),
      actorId,
      memorialId,
      action,
      payload,
      createdAt: nowIso(),
    });
  }

  addNote(memorialId: string, authorId: string | null, body: string) {
    const note = { id: randomUUID(), memorialId, authorId, body, createdAt: nowIso() };
    this.notes.push(note);
    return note;
  }

  enqueueExport(memorialId: string, requestedBy: string | null) {
    const job: ExportJob = {
      id: randomUUID(),
      memorialId,
      requestedBy,
      status: "ready",
      downloadPath: `/api/exports/${memorialId}`,
    };
    this.exportJobs.push(job);
    return job;
  }

  setOtp(email: string, code: string) {
    this.otp.set(email.toLowerCase(), { code, expiresAt: Date.now() + 10 * 60 * 1000 });
  }

  verifyOtp(email: string, code: string) {
    const row = this.otp.get(email.toLowerCase());
    if (!row || row.code !== code || row.expiresAt < Date.now()) return false;
    this.otp.delete(email.toLowerCase());
    return true;
  }
}

const globalStore = globalThis as typeof globalThis & { __lifemarkedStore?: PlatformRepository };
export const store = globalStore.__lifemarkedStore ?? new PlatformRepository();
globalStore.__lifemarkedStore = store;

export { PlatformRepository };
