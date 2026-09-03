export const ADMIN_MEMORIAL_NOTICES = {
  invited: "Invite created. Copy the link below and send it to the family — they use it to sign in and write the memorial.",
  live: "This memorial is now live. Visitors and QR scans will see the version you just made live.",
  sent_back: "Sent back to the family so they can keep editing. The public page has not changed.",
  address: "New web address added. The previous address still works, so old links and markers are safe.",
  restored: "The public page now shows the earlier version you chose.",
  hidden: "Hidden. QR scans and the public page now show that this memorial is unavailable.",
  shown: "Visible again. Visitors and QR scans can see the live memorial.",
  noted: "Staff note saved. The family cannot see it.",
} as const;

export type AdminMemorialNotice = keyof typeof ADMIN_MEMORIAL_NOTICES;

export function memorialDeskPath(memorialId: string, notice?: AdminMemorialNotice) {
  if (!notice) return `/admin/memorials/${memorialId}`;
  return `/admin/memorials/${memorialId}?done=${notice}`;
}

export function noticeFromQuery(value: string | string[] | undefined): string | null {
  const key = Array.isArray(value) ? value[0] : value;
  if (!key || !(key in ADMIN_MEMORIAL_NOTICES)) return null;
  return ADMIN_MEMORIAL_NOTICES[key as AdminMemorialNotice];
}
