export const MEMORIAL_STATUSES = [
  "draft",
  "owner_invited",
  "in_progress",
  "in_review",
  "changes_requested",
  "published",
  "archived",
  "disabled",
] as const;

export type MemorialStatus = (typeof MEMORIAL_STATUSES)[number];

export const VISIBILITIES = ["unlisted", "public", "private"] as const;
export type Visibility = (typeof VISIBILITIES)[number];

export const PUBLISHING_MODES = ["admin_review", "self_publish"] as const;
export type PublishingMode = (typeof PUBLISHING_MODES)[number];

export const MEMBER_ROLES = ["owner", "editor", "viewer"] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const MEDIA_KINDS = ["image", "audio", "video", "caption"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export const MEDIA_STATUSES = [
  "awaiting_upload",
  "uploaded",
  "scanning",
  "quarantined",
  "processing",
  "ready",
  "failed",
  "deleted",
] as const;
export type MediaStatus = (typeof MEDIA_STATUSES)[number];

export const SECTION_KEYS = [
  "hero",
  "story",
  "timeline",
  "gallery",
  "favourites",
  "memories",
  "voice",
  "video",
  "places",
  "close",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Opening",
  story: "Their story",
  timeline: "Life moments",
  gallery: "Photographs",
  favourites: "Favourites",
  memories: "Memories",
  voice: "Voice",
  video: "Video",
  places: "Places",
  close: "Closing words",
};
