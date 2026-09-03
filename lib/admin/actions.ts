"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendFamilyInviteEmail } from "@/lib/email/invite";
import { isMemorialLive } from "@/lib/platform/lifecycle";
import { memorialDeskPath, type AdminMemorialNotice } from "@/lib/admin/notices";
import { requireAdmin } from "@/lib/auth/session";
import { store } from "@/lib/platform/store";

function revalidateMemorial(memorialId: string) {
  const slug = store.routes.find((route) => route.memorialId === memorialId && route.isCanonical)?.slug ?? "";
  revalidatePath("/admin");
  revalidatePath("/admin/memorials");
  revalidatePath("/admin/review");
  revalidatePath(`/admin/memorials/${memorialId}`);
  if (slug) revalidatePath(`/m/${slug}`);
}

function inviteNotice(status: "sent" | "skipped" | "failed"): AdminMemorialNotice {
  if (status === "sent") return "invited";
  if (status === "skipped") return "invited_link";
  return "invite_failed";
}

async function deliverInvitation(memorialId: string, invitation: {
  id: string;
  email: string;
  kind: "owner" | "collaborator";
  collaboratorRole?: "owner" | "editor" | "viewer" | null;
  rawToken?: string;
  expiresAt: string;
}) {
  const memorial = store.getMemorial(memorialId);
  if (!invitation.rawToken || !memorial) return "failed" as const;
  const result = await sendFamilyInviteEmail({
    to: invitation.email,
    memorialName: memorial.fullName,
    firstName: memorial.firstName,
    rawToken: invitation.rawToken,
    expiresAt: invitation.expiresAt,
    kind: invitation.kind,
    collaboratorRole: invitation.collaboratorRole,
  });
  if (result.status !== "failed") store.markInviteSent(invitation.id);
  return result.status;
}

export async function adminCreateMemorial(formData: FormData) {
  const session = await requireAdmin();
  const created = store.createMemorial({
    fullName: String(formData.get("fullName") ?? "").trim(),
    firstName: String(formData.get("firstName") ?? "").trim() || undefined,
    slug: String(formData.get("slug") ?? "").trim(),
    actorId: session.user.id,
    publishingMode: formData.get("publishingMode") === "self_publish" ? "self_publish" : "admin_review",
  });
  const email = String(formData.get("ownerEmail") ?? "").trim();
  let notice: AdminMemorialNotice | undefined;
  if (email) {
    const invitation = await store.inviteOwner(created.id, email, session.user.id);
    notice = inviteNotice(await deliverInvitation(created.id, invitation));
  }
  revalidateMemorial(created.id);
  redirect(memorialDeskPath(created.id, notice));
}

export async function adminInviteOwner(memorialId: string, formData: FormData) {
  const session = await requireAdmin();
  const invitation = await store.inviteOwner(memorialId, String(formData.get("email") ?? ""), session.user.id);
  const notice = inviteNotice(await deliverInvitation(memorialId, invitation));
  revalidateMemorial(memorialId);
  redirect(memorialDeskPath(memorialId, notice));
}

export async function adminRevokeInvite(memorialId: string, formData: FormData) {
  await requireAdmin();
  store.revokeInvitation(String(formData.get("inviteId") ?? ""));
  revalidateMemorial(memorialId);
  redirect(memorialDeskPath(memorialId, "invite_deleted"));
}

export async function adminResendInvite(memorialId: string, formData: FormData) {
  const session = await requireAdmin();
  const inviteId = String(formData.get("inviteId") ?? "");
  const existing = store.invitations.find((row) => row.id === inviteId && row.memorialId === memorialId);
  if (!existing) throw new Error("Invite not found.");
  const expired = new Date(existing.expiresAt).getTime() < Date.now();
  const invitation =
    existing.revokedAt || expired || !existing.rawToken
      ? await store.renewInvitation(inviteId, session.user.id)
      : existing;
  const notice = inviteNotice(await deliverInvitation(memorialId, invitation));
  revalidateMemorial(memorialId);
  redirect(memorialDeskPath(memorialId, notice === "invited" ? "invite_resent" : notice));
}

export async function adminTogglePublished(memorialId: string) {
  const session = await requireAdmin();
  const memorial = store.getMemorial(memorialId);
  if (!memorial) throw new Error("Memorial not found.");
  if (isMemorialLive(memorial)) {
    store.disable(memorialId, "ops", session.user.id);
  } else {
    if (memorial.disabledAt || memorial.status === "disabled") {
      store.enable(memorialId, session.user.id);
    }
    const current = store.getMemorial(memorialId);
    if (!current?.publishedVersionId) {
      store.publish(memorialId, session.user.id, "admin_publish");
    }
  }
  revalidateMemorial(memorialId);
}

export async function adminPublish(memorialId: string) {
  const session = await requireAdmin();
  store.publish(memorialId, session.user.id, "admin_publish");
  revalidateMemorial(memorialId);
  redirect(memorialDeskPath(memorialId, "live"));
}

export async function adminRequestChanges(memorialId: string, formData: FormData) {
  const session = await requireAdmin();
  store.requestChanges(memorialId, session.user.id, String(formData.get("note") ?? ""));
  revalidateMemorial(memorialId);
  redirect(memorialDeskPath(memorialId, "sent_back"));
}

export async function adminRollback(memorialId: string, formData: FormData) {
  const session = await requireAdmin();
  store.rollback(memorialId, String(formData.get("versionId") ?? ""), session.user.id);
  revalidateMemorial(memorialId);
  redirect(memorialDeskPath(memorialId, "restored"));
}

export async function adminAddNote(memorialId: string, formData: FormData) {
  const session = await requireAdmin();
  store.addNote(memorialId, session.user.id, String(formData.get("body") ?? ""));
  revalidateMemorial(memorialId);
  redirect(memorialDeskPath(memorialId, "noted"));
}

export async function adminChangeSlug(memorialId: string, formData: FormData) {
  await requireAdmin();
  store.changeSlug(memorialId, String(formData.get("slug") ?? "").trim());
  revalidateMemorial(memorialId);
  redirect(memorialDeskPath(memorialId, "address"));
}

export async function adminDisable(memorialId: string, formData: FormData) {
  const session = await requireAdmin();
  store.disable(memorialId, String(formData.get("reason") ?? ""), session.user.id);
  revalidateMemorial(memorialId);
  redirect(memorialDeskPath(memorialId, "hidden"));
}

export async function adminEnable(memorialId: string) {
  const session = await requireAdmin();
  store.enable(memorialId, session.user.id);
  revalidateMemorial(memorialId);
  redirect(memorialDeskPath(memorialId, "shown"));
}

export async function adminRestore(memorialId: string) {
  const session = await requireAdmin();
  store.restoreMemorial(memorialId, session.user.id);
  revalidatePath("/admin/memorials");
}

export async function adminCreatePartner(formData: FormData) {
  await requireAdmin();
  const id = globalThis.crypto.randomUUID();
  store.partners.set(id, { id, name: String(formData.get("name") ?? "") });
  revalidatePath("/admin/partners");
}

export async function adminCreatePackage(formData: FormData) {
  await requireAdmin();
  const id = globalThis.crypto.randomUUID();
  store.packages.set(id, {
    id,
    name: String(formData.get("name") ?? ""),
    publishingMode: formData.get("publishingMode") === "self_publish" ? "self_publish" : "admin_review",
  });
  revalidatePath("/admin/packages");
}

export async function adminRetryMedia(assetId: string) {
  await requireAdmin();
  const asset = store.media.get(assetId);
  if (!asset) return;
  if (asset.status === "quarantined" || asset.status === "failed") {
    store.media.set(assetId, { ...asset, status: "uploaded" });
    try {
      store.setAssetStatus(assetId, "scanning");
    } catch {
      asset.status = "scanning";
    }
  }
  revalidatePath("/admin/media");
}
