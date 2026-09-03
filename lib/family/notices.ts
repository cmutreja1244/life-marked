export const FAMILY_EDITOR_NOTICES = {
  invited: "Invitation emailed. They have 14 days to open the link.",
  invited_link: "Invitation created, but email could not be sent from this environment. Copy the link below, or use Resend.",
  invite_failed: "Invitation created, but the email did not send. Use Resend.",
  invite_deleted: "That invite will no longer work.",
  invite_resent: "Invitation emailed again.",
  memory_link: "The shareable link is ready.",
  memory_sent: "We emailed the memory request.",
  memory_skipped: "The link is ready, but email could not be sent from this environment. Copy the link instead.",
  memory_failed: "The email did not send. You can still copy the link.",
  closed: "This memorial is hidden from visitors. You can cancel within 30 days.",
  reopened: "Close cancelled. Family can keep working on the memorial.",
  approved: "That memory is now in the draft.",
  declined: "That memory was declined.",
} as const;

export type FamilyEditorNotice = keyof typeof FAMILY_EDITOR_NOTICES;

export function editorOverviewPath(memorialId: string, notice?: FamilyEditorNotice) {
  if (!notice) return `/memorials/${memorialId}/overview`;
  return `/memorials/${memorialId}/overview?done=${notice}`;
}

export function editorMemoriesPath(memorialId: string, notice?: FamilyEditorNotice) {
  if (!notice) return `/memorials/${memorialId}/memories`;
  return `/memorials/${memorialId}/memories?done=${notice}`;
}

export function familyNoticeFromQuery(value: string | string[] | undefined): string | null {
  const key = Array.isArray(value) ? value[0] : value;
  if (!key || !(key in FAMILY_EDITOR_NOTICES)) return null;
  return FAMILY_EDITOR_NOTICES[key as FamilyEditorNotice];
}

export function inviteNoticeFromStatus(status: "sent" | "skipped" | "failed"): FamilyEditorNotice {
  if (status === "sent") return "invited";
  if (status === "skipped") return "invited_link";
  return "invite_failed";
}
