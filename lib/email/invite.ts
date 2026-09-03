import { sendTransactionalEmail } from "@/lib/email/sendgrid";
import { formatEmailDate, transactionalEmailHtml } from "@/lib/email/chrome";
import { PUBLIC_ORIGIN } from "@/lib/site";

export function inviteUrl(rawToken: string) {
  return `${PUBLIC_ORIGIN}/invite/${rawToken}`;
}

export function contributionUrl(rawToken: string) {
  return `${PUBLIC_ORIGIN}/c/${rawToken}`;
}

function memorialLabel(name: string) {
  return name.trim() || "this memorial";
}

export function familyInviteEmailHtml(input: {
  recipientEmail: string;
  memorialName: string;
  inviteHref: string;
  expiresLabel: string;
  kind: "owner" | "collaborator";
  collaboratorRole?: "owner" | "editor" | "viewer" | null;
}) {
  const name = memorialLabel(input.memorialName);
  const headline = `You are invited to manage ${name}'s memorial`;
  const paragraphs =
    input.kind === "owner"
      ? [
          `This is a private link to ${name}'s memorial on LifeMarked.`,
          "Sign in with this email address, then you can add their story, photographs, and memories. Visitors and QR scans will not see your changes until a version is made live.",
        ]
      : input.collaboratorRole === "viewer"
        ? [
            `You have been invited to look at the draft of ${name}'s memorial on LifeMarked.`,
            "You can read it, but you cannot change it. Visitors and QR scans will not see this draft until a version is made live.",
          ]
        : [
            `You have been invited to help with ${name}'s memorial on LifeMarked.`,
            "You can add and edit the story, photographs, and memories. Visitors and QR scans will not see your changes until a version is made live.",
          ];

  return transactionalEmailHtml({
    recipientEmail: input.recipientEmail,
    headline,
    paragraphs,
    ctaLabel: "Open the memorial",
    ctaHref: input.inviteHref,
    expiryNote: `This link expires on ${input.expiresLabel}.`,
  });
}

export async function sendFamilyInviteEmail(input: {
  to: string;
  memorialName: string;
  firstName: string;
  rawToken: string;
  expiresAt: string;
  kind: "owner" | "collaborator";
  collaboratorRole?: "owner" | "editor" | "viewer" | null;
}) {
  const inviteHref = inviteUrl(input.rawToken);
  const expiresLabel = formatEmailDate(input.expiresAt);
  const html = familyInviteEmailHtml({
    recipientEmail: input.to,
    memorialName: input.memorialName,
    inviteHref,
    expiresLabel,
    kind: input.kind,
    collaboratorRole: input.collaboratorRole,
  });
  try {
    const result = await sendTransactionalEmail(
      input.to,
      `You are invited to manage ${memorialLabel(input.memorialName)}'s memorial`,
      html,
    );
    return result.skipped ? ({ status: "skipped" } as const) : ({ status: "sent" } as const);
  } catch {
    return { status: "failed" } as const;
  }
}

export function memoryRequestEmailHtml(input: {
  recipientEmail: string;
  memorialName: string;
  shareHref: string;
  expiresLabel: string;
}) {
  const name = memorialLabel(input.memorialName);
  return transactionalEmailHtml({
    recipientEmail: input.recipientEmail,
    headline: `Please share a memory of ${name}`,
    paragraphs: [
      `The family of ${name} would like you to share a memory.`,
      "Write a few words and your name. It will not appear on the memorial until the family accept it.",
    ],
    ctaLabel: "Share a memory",
    ctaHref: input.shareHref,
    expiryNote: `This link expires on ${input.expiresLabel}.`,
  });
}

export async function sendMemoryRequestEmail(input: {
  to: string;
  memorialName: string;
  rawToken: string;
  expiresAt: string;
}) {
  const shareHref = contributionUrl(input.rawToken);
  const expiresLabel = formatEmailDate(input.expiresAt);
  const html = memoryRequestEmailHtml({
    recipientEmail: input.to,
    memorialName: input.memorialName,
    shareHref,
    expiresLabel,
  });
  try {
    const result = await sendTransactionalEmail(input.to, `Please share a memory of ${memorialLabel(input.memorialName)}`, html);
    return result.skipped ? ({ status: "skipped" } as const) : ({ status: "sent" } as const);
  } catch {
    return { status: "failed" } as const;
  }
}
