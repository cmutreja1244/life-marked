import type { MediaStatus } from "./enums";

const TRANSITIONS: Record<MediaStatus, MediaStatus[]> = {
  awaiting_upload: ["uploaded", "deleted"],
  uploaded: ["scanning", "deleted"],
  scanning: ["quarantined", "processing", "failed"],
  quarantined: ["scanning", "deleted"],
  processing: ["ready", "failed"],
  failed: ["scanning", "processing", "deleted"],
  ready: ["deleted"],
  deleted: [],
};

export function canTransitionMedia(from: MediaStatus, to: MediaStatus) {
  return TRANSITIONS[from].includes(to);
}

export function transitionMedia(from: MediaStatus, to: MediaStatus): MediaStatus {
  if (!canTransitionMedia(from, to)) {
    throw new Error(`Cannot move media from ${from} to ${to}.`);
  }
  return to;
}

export function canPublishAsset(status: MediaStatus) {
  return status === "ready";
}

export function canPhysicallyPurge(args: {
  deletedAt: string | null;
  graceElapsed: boolean;
  snapshotReferenceCount: number;
  workingCopyReferenceCount: number;
}) {
  return (
    Boolean(args.deletedAt) &&
    args.graceElapsed &&
    args.snapshotReferenceCount === 0 &&
    args.workingCopyReferenceCount === 0
  );
}
