"use server";

import { revalidatePath } from "next/cache";
import { requireFamily, requireMemorialAccess } from "@/lib/auth/session";
import { sendFamilyInviteEmail } from "@/lib/email/invite";
import { store } from "@/lib/platform/store";
import { sanitiseTiptap, type TipTapNode } from "@/lib/platform/tiptap";
import type { SectionKey } from "@/lib/platform/enums";

async function touch(memorialId: string) {
  revalidatePath(`/memorials/${memorialId}`);
  revalidatePath(`/preview/${memorialId}`);
  revalidatePath("/home");
}

export async function saveAbout(memorialId: string, formData: FormData) {
  await requireMemorialAccess(memorialId, "edit");
  store.updateMemorial(memorialId, {
    firstName: String(formData.get("firstName") ?? ""),
    fullName: String(formData.get("fullName") ?? ""),
    openingLine: String(formData.get("openingLine") ?? ""),
    intro: String(formData.get("intro") ?? ""),
    birth: { year: Number(formData.get("birthYear") || 0) || null },
    death: { year: Number(formData.get("deathYear") || 0) || null },
    heroImageAlt: String(formData.get("heroImageAlt") ?? ""),
    closingHeading: String(formData.get("closingHeading") ?? ""),
    closingText: String(formData.get("closingText") ?? ""),
    visibility: (String(formData.get("visibility") ?? "unlisted") as "unlisted" | "public" | "private"),
    indexOptIn: formData.get("indexOptIn") === "on",
  });
  await touch(memorialId);
}

export async function saveStory(memorialId: string, document: TipTapNode, pullQuote: string) {
  await requireMemorialAccess(memorialId, "edit");
  store.updateMemorial(memorialId, { pullQuote });
  store.updateContent(memorialId, { story: sanitiseTiptap(document) });
  await touch(memorialId);
}

export async function saveTimeline(memorialId: string, formData: FormData) {
  await requireMemorialAccess(memorialId, "edit");
  const raw = String(formData.get("timeline") ?? "[]");
  const parsed = JSON.parse(raw) as Array<{ year: string; title: string; detail: string }>;
  const timeline = parsed.filter((item) => item.year.trim() || item.title.trim() || item.detail.trim());
  store.updateContent(memorialId, { timeline });
  await touch(memorialId);
}

export async function saveFavourites(memorialId: string, formData: FormData) {
  await requireMemorialAccess(memorialId, "edit");
  const raw = String(formData.get("favourites") ?? "");
  let favouriteThings: string[] = [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) favouriteThings = parsed.map((item) => String(item).trim()).filter(Boolean);
    else throw new Error("not json array");
  } catch {
    favouriteThings = raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }
  store.updateContent(memorialId, { favouriteThings });
  await touch(memorialId);
}

export async function saveMemories(memorialId: string, formData: FormData) {
  await requireMemorialAccess(memorialId, "edit");
  const raw = String(formData.get("memories") ?? "");
  let memories: Array<{ quote: string; author: string; status: "approved" }>;
  try {
    const parsed = JSON.parse(raw) as Array<{ quote?: string; author?: string }>;
    memories = parsed
      .map((item) => ({ quote: String(item.quote ?? "").trim(), author: String(item.author ?? "").trim(), status: "approved" as const }))
      .filter((item) => item.quote || item.author);
  } catch {
    memories = raw
      .split("\n\n")
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        const [quote, author] = block.split("\n—").map((part) => part.trim());
        return { quote: quote ?? "", author: author ?? "", status: "approved" as const };
      });
  }
  store.updateContent(memorialId, { memories });
  await touch(memorialId);
}

export async function savePlaces(memorialId: string, formData: FormData) {
  await requireMemorialAccess(memorialId, "edit");
  const heroAssetId = store.getMemorial(memorialId)?.heroAssetId ?? null;
  const raw = String(formData.get("places") ?? "");
  let places: Array<{ heading: string; location: string; text: string; caption: string; assetId: string | null; imageAlt: string }>;
  try {
    const parsed = JSON.parse(raw) as Array<{ heading?: string; location?: string; text?: string; caption?: string }>;
    places = parsed
      .map((place) => ({
        heading: String(place.heading ?? "A place they loved"),
        location: String(place.location ?? ""),
        text: String(place.text ?? ""),
        caption: String(place.caption ?? ""),
        assetId: heroAssetId,
        imageAlt: "",
      }))
      .filter((place) => place.location || place.text);
  } catch {
    places = [
      {
        heading: String(formData.get("heading") ?? "A place they loved"),
        location: String(formData.get("location") ?? ""),
        text: String(formData.get("text") ?? ""),
        assetId: heroAssetId,
        imageAlt: String(formData.get("imageAlt") ?? ""),
        caption: String(formData.get("caption") ?? ""),
      },
    ].filter((place) => place.location || place.text);
  }
  store.updateContent(memorialId, { places });
  await touch(memorialId);
}

export async function saveVoice(memorialId: string, formData: FormData) {
  await requireMemorialAccess(memorialId, "edit");
  store.updateContent(memorialId, {
    voice: {
      label: "Voice memory",
      title: String(formData.get("title") ?? ""),
      recorded: String(formData.get("recorded") ?? ""),
      supportingText: String(formData.get("supportingText") ?? ""),
      assetId: String(formData.get("assetId") || "") || null,
      imageAssetId: store.getMemorial(memorialId)?.heroAssetId ?? null,
      imageAlt: String(formData.get("imageAlt") ?? ""),
    },
  });
  await touch(memorialId);
}

export async function saveVideo(memorialId: string, formData: FormData) {
  await requireMemorialAccess(memorialId, "edit");
  store.updateContent(memorialId, {
    video: {
      title: String(formData.get("title") ?? "Video memory"),
      assetId: String(formData.get("assetId") || "") || null,
      posterAssetId: null,
    },
  });
  await touch(memorialId);
}

export async function saveSections(memorialId: string, formData: FormData) {
  await requireMemorialAccess(memorialId, "edit");
  const enabled = new Set(formData.getAll("section").map(String));
  const content = store.content.get(memorialId);
  if (!content) return;
  store.updateContent(memorialId, {
    sections: content.sections.map((section) => ({
      ...section,
      enabled: enabled.has(section.key),
    })),
  });
  await touch(memorialId);
}

export async function acceptInviteAction(formData: FormData) {
  const session = await requireFamily();
  const token = String(formData.get("token") ?? "");
  const memorialId = await store.acceptInvite(token, session.user);
  revalidatePath("/home");
  return memorialId;
}

export async function submitMemorial(memorialId: string) {
  const { session } = await requireMemorialAccess(memorialId, "edit");
  store.submitForReview(memorialId, session.user.id);
  await touch(memorialId);
}

export async function selfPublish(memorialId: string) {
  const { session } = await requireMemorialAccess(memorialId, "edit");
  store.publish(memorialId, session.user.id, "self_publish");
  await touch(memorialId);
}

export async function inviteCollaboratorAction(memorialId: string, formData: FormData) {
  const { session } = await requireMemorialAccess(memorialId, "manage");
  const invitation = await store.inviteCollaborator(
    memorialId,
    String(formData.get("email") ?? ""),
    String(formData.get("role") ?? "editor") === "viewer" ? "viewer" : "editor",
    session.user.id,
  );
  const memorial = store.getMemorial(memorialId);
  if (invitation.rawToken && memorial) {
    const result = await sendFamilyInviteEmail({
      to: invitation.email,
      memorialName: memorial.fullName,
      firstName: memorial.firstName,
      rawToken: invitation.rawToken,
      expiresAt: invitation.expiresAt,
      kind: "collaborator",
    });
    if (result.status !== "failed") store.markInviteSent(invitation.id);
  }
  await touch(memorialId);
}

export async function createContributionLinkAction(memorialId: string, formData: FormData) {
  const { session } = await requireMemorialAccess(memorialId, "manage");
  const kinds = String(formData.get("kinds") ?? "memory").split(",") as Array<"memory" | "photo" | "audio" | "video">;
  await store.createContributionLink(memorialId, {
    allowedKinds: kinds,
    maxSubmissions: Number(formData.get("max") ?? 20),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    reusable: true,
  });
  store.recordAudit(session.user.id, memorialId, "contribution_link.created", {});
  await touch(memorialId);
}

export async function requestExport(memorialId: string) {
  const { session } = await requireMemorialAccess(memorialId, "manage");
  return store.enqueueExport(memorialId, session.user.id);
}

export async function scheduleMemorialDelete(memorialId: string) {
  const { session } = await requireMemorialAccess(memorialId, "manage");
  store.scheduleDelete(memorialId, session.user.id);
  revalidatePath("/home");
}

export type { SectionKey };
