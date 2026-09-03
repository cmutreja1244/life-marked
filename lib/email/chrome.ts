import { EMAIL_LOGO_SRC } from "@/lib/site";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function transactionalEmailHtml(input: {
  recipientEmail: string;
  headline: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
  expiryNote: string;
}) {
  const paragraphs = input.paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#6e6a63;">${escapeHtml(paragraph)}</p>`,
    )
    .join("");
  const href = escapeHtml(input.ctaHref);
  const headline = escapeHtml(input.headline);
  const logo = escapeHtml(EMAIL_LOGO_SRC);

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f0e8;color:#242422;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0e8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#f4f0e8;">
            <tr>
              <td style="padding:8px 8px 28px;">
                <img src="${logo}" alt="LifeMarked" width="180" style="display:block;width:180px;max-width:60%;height:auto;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border:1px solid rgba(110,106,99,0.22);border-radius:8px;padding:36px 32px;">
                <h1 style="margin:0;font-size:32px;line-height:1.2;font-weight:400;">${headline}</h1>
                ${paragraphs}
                <p style="margin:28px 0 0;">
                  <a href="${href}" style="display:inline-block;background:#242422;color:#f4f0e8;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;letter-spacing:0.02em;padding:14px 24px;border-radius:6px;">
                    ${escapeHtml(input.ctaLabel)}
                  </a>
                </p>
                <p style="margin:28px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#6e6a63;">
                  ${escapeHtml(input.expiryNote)} If the button does not work, paste this address into your browser:
                </p>
                <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;word-break:break-all;color:#242422;">
                  ${href}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#6e6a63;">
                LifeMarked. Every life leaves more than a name.<br />
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

export function formatEmailDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
