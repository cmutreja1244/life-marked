import type {
  MediaKind,
  MediaStatus,
  MemberRole,
  MemorialStatus,
  PublishingMode,
  SectionKey,
  Visibility,
} from "./enums";
import { SECTION_KEYS } from "./enums";
import type { FuzzyDate } from "./fuzzy-dates";
import type { PublishedSnapshot, WorkingCopy } from "./snapshot";
import type { TipTapNode } from "./tiptap";

export type Profile = {
  id: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  adminRole: "super_admin" | "operations" | null;
  passwordHash?: string;
  totpSecret?: string;
  tosAcceptedAt: string | null;
  deletedAt: string | null;
};

export type MemorialRecord = {
  id: string;
  publicToken: string;
  ownerId: string | null;
  partnerId: string | null;
  packageId: string | null;
  firstName: string;
  fullName: string;
  birth: FuzzyDate;
  death: FuzzyDate;
  openingLine: string;
  intro: string;
  closingHeading: string;
  closingText: string;
  pullQuote: string;
  heroAssetId: string | null;
  heroImageAlt: string;
  heroFocalY: number;
  status: MemorialStatus;
  visibility: Visibility;
  publishingMode: PublishingMode;
  indexOptIn: boolean;
  isDemo: boolean;
  publishedVersionId: string | null;
  publishedAt: string | null;
  markerStatus: string;
  scanCount: number;
  lastScannedAt: string | null;
  disabledAt: string | null;
  disabledReason: string | null;
  deletedAt: string | null;
  purgeAfter: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MediaAssetRecord = {
  id: string;
  memorialId: string;
  kind: MediaKind;
  status: MediaStatus;
  originalKey: string | null;
  originalBytes: Uint8Array | null;
  publicUrl: string | null;
  mime: string | null;
  sha256: string | null;
  altText: string;
  caption: string;
  focalX: number | null;
  focalY: number | null;
  durationLabel: string | null;
  waveform: number[] | null;
  quarantineReason: string | null;
  createdAt: string;
  deletedAt: string | null;
};

export type PublicationVersion = {
  id: string;
  memorialId: string;
  versionNumber: number;
  snapshot: PublishedSnapshot;
  createdBy: string | null;
  createdAt: string;
  trigger: string;
  assetIds: string[];
};

export type Invitation = {
  id: string;
  memorialId: string;
  email: string;
  kind: "owner" | "collaborator";
  collaboratorRole: MemberRole | null;
  tokenHash: string;
  rawToken?: string;
  expiresAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  sentAt: string | null;
};

export type ContributionLinkRecord = {
  id: string;
  memorialId: string;
  tokenHash: string;
  rawToken?: string;
  expiresAt: string;
  revokedAt: string | null;
  reusable: boolean;
  maxSubmissions: number;
  submissionCount: number;
  allowedKinds: Array<"memory" | "photo" | "audio" | "video">;
  requireEmail: boolean;
};

export type ContributionRecord = {
  id: string;
  memorialId: string;
  contributionLinkId: string;
  kind: "memory" | "photo" | "audio" | "video";
  payload: Record<string, unknown>;
  status: "pending" | "approved" | "rejected";
  submitterName: string;
  submitterEmail: string | null;
};

export const defaultSections = (): Array<{ key: SectionKey; enabled: boolean; sort: number }> =>
  SECTION_KEYS.map((key, sort) => ({ key, enabled: true, sort }));

export type MemorialContent = {
  story: TipTapNode | null;
  biography: string[];
  timeline: WorkingCopy["timeline"];
  gallery: WorkingCopy["gallery"];
  storyImages: WorkingCopy["storyImages"];
  memories: WorkingCopy["memories"];
  favouriteThings: string[];
  voice: WorkingCopy["voice"];
  video: WorkingCopy["video"];
  places: WorkingCopy["places"];
  sections: Array<{ key: SectionKey; enabled: boolean; sort: number }>;
};
