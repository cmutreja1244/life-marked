import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid form data";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const webhookUrl = process.env.LIFEMARKED_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Contact form is not yet configured. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parsed.data,
        submitted_at: new Date().toISOString(),
        source: "lifemarked-website",
      }),
    });

    if (!webhookResponse.ok) {
      return NextResponse.json(
        { error: "Unable to submit your message. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit your message. Please try again." },
      { status: 502 },
    );
  }
}
