"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { store } from "@/lib/platform/store";

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
  if (email) await store.inviteOwner(created.id, email, session.user.id);
  revalidatePath("/admin");
  redirect(`/admin/memorials/${created.id}`);
}

export async function adminInviteOwner(memorialId: string, formData: FormData) {
  const session = await requireAdmin();
  await store.inviteOwner(memorialId, String(formData.get("email") ?? ""), session.user.id);
  revalidatePath(`/admin/memorials/${memorialId}`);
}

export async function adminPublish(memorialId: string) {
  const session = await requireAdmin();
  store.publish(memorialId, session.user.id, "admin_publish");
  revalidatePath(`/m/${store.routes.find((route) => route.memorialId === memorialId && route.isCanonical)?.slug ?? ""}`);
  revalidatePath(`/admin/memorials/${memorialId}`);
}

export async function adminRequestChanges(memorialId: string, formData: FormData) {
  const session = await requireAdmin();
  store.requestChanges(memorialId, session.user.id, String(formData.get("note") ?? ""));
  revalidatePath("/admin/review");
}

export async function adminRollback(memorialId: string, formData: FormData) {
  const session = await requireAdmin();
  store.rollback(memorialId, String(formData.get("versionId") ?? ""), session.user.id);
  revalidatePath(`/admin/memorials/${memorialId}`);
}

export async function adminAddNote(memorialId: string, formData: FormData) {
  const session = await requireAdmin();
  store.addNote(memorialId, session.user.id, String(formData.get("body") ?? ""));
  revalidatePath(`/admin/memorials/${memorialId}`);
}

export async function adminChangeSlug(memorialId: string, formData: FormData) {
  await requireAdmin();
  store.changeSlug(memorialId, String(formData.get("slug") ?? "").trim());
  revalidatePath(`/admin/memorials/${memorialId}`);
}

export async function adminDisable(memorialId: string, formData: FormData) {
  const session = await requireAdmin();
  store.disable(memorialId, String(formData.get("reason") ?? ""), session.user.id);
  revalidatePath(`/admin/memorials/${memorialId}`);
}

export async function adminEnable(memorialId: string) {
  const session = await requireAdmin();
  store.enable(memorialId, session.user.id);
  revalidatePath(`/admin/memorials/${memorialId}`);
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
