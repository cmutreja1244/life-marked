import { env } from "@/lib/env";

const FROM = "LifeMarked <support@lifemarked.co.uk>";

export async function sendTransactionalEmail(to: string, subject: string, html: string) {
  if (!env.sendgridApiKey) {
    console.info(`[email skipped] ${to} ${subject}`);
    return { skipped: true as const };
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.sendgridApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "support@lifemarked.co.uk", name: "LifeMarked" },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });

  if (!response.ok) {
    throw new Error(`SendGrid rejected the message (${response.status}).`);
  }

  return { skipped: false as const };
}

export { FROM };
