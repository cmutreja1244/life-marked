import { sendTransactionalEmail } from "@/lib/email/sendgrid";
import { CANONICAL_ORIGIN } from "@/lib/site";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function inviteUrl(rawToken: string) {
  return `${CANONICAL_ORIGIN}/invite/${rawToken}`;
}

export function familyInviteEmailHtml(input: {
  recipientEmail: string;
  memorialName: string;
  firstName: string;
  inviteHref: string;
  expiresLabel: string;
  kind: "owner" | "collaborator";
}) {
  const name = escapeHtml(input.memorialName || "a memorial");
  const first = escapeHtml(input.firstName || "them");
  const href = escapeHtml(input.inviteHref);
  const expires = escapeHtml(input.expiresLabel);
  const intro =
    input.kind === "owner"
      ? `LifeMarked has prepared a memorial for ${name}. You have been asked to write it — the story, photographs, and memories that belong with ${first}.`
      : `You have been invited to help with ${name}'s memorial on LifeMarked.`;

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f0e8;color:#242422;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0e8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#f4f0e8;">
            <tr>
              <td style="padding:8px 8px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#6e6a63;">
                LifeMarked
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border:1px solid rgba(110,106,99,0.22);border-radius:8px;padding:36px 32px;">
                <h1 style="margin:0;font-size:32px;line-height:1.2;font-weight:400;">You are invited to write ${name}'s memorial</h1>
                <p style="margin:20px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#6e6a63;">
                  ${intro}
                </p>
                <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#6e6a63;">
                  This is a private link. It is not the public page, and it does not change what visitors see until a version is made live.
                </p>
                <p style="margin:28px 0 0;">
                  <a href="${href}" style="display:inline-block;background:#242422;color:#f4f0e8;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;letter-spacing:0.02em;padding:14px 24px;border-radius:6px;">
                    Open the memorial
                  </a>
                </p>
                <p style="margin:28px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#6e6a63;">
                  The link expires on ${expires}. If the button does not work, paste this address into your browser:
                </p>
                <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;word-break:break-all;color:#242422;">
                  ${href}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#6e6a63;">
                LifeMarked · Every life leaves more than a name.<br />
                Sent to ${escapeHtml(input.recipientEmail)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendFamilyInviteEmail(input: {
  to: string;
  memorialName: string;
  firstName: string;
  rawToken: string;
  expiresAt: string;
  kind: "owner" | "collaborator";
}) {
  const inviteHref = inviteUrl(input.rawToken);
  const expiresLabel = new Date(input.expiresAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const html = familyInviteEmailHtml({
    recipientEmail: input.to,
    memorialName: input.memorialName,
    firstName: input.firstName,
    inviteHref,
    expiresLabel,
    kind: input.kind,
  });
  try {
    const result = await sendTransactionalEmail(
      input.to,
      `You are invited to write ${input.memorialName || "a LifeMarked memorial"}`,
      html,
    );
    return result.skipped ? ({ status: "skipped" } as const) : ({ status: "sent" } as const);
  } catch {
    return { status: "failed" } as const;
  }
}
