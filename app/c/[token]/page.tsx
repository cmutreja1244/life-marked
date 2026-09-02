import { store } from "@/lib/platform/store";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

async function submitContribution(token: string, formData: FormData) {
  "use server";
  const ip = (await headers()).get("x-forwarded-for") ?? "local";
  const limited = await rateLimit("contribution", ip, 10, 10 * 60 * 1000);
  if (!limited.success) throw new Error("Please wait before sending another memory.");
  const link = await store.getContributionLink(token);
  if (!link) throw new Error("This invitation is no longer active.");
  store.submitContribution(
    link,
    "memory",
    { quote: String(formData.get("quote") ?? "") },
    String(formData.get("name") ?? "A friend"),
    String(formData.get("email") ?? "") || null,
  );
}

export default async function ContributionPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const link = await store.getContributionLink(token);
  const invalid = !link || Boolean(link.revokedAt);

  return (
    <main className="mx-auto max-w-lg px-5 py-16">
      <h1 className="font-serif text-4xl">Share a memory</h1>
      {invalid ? (
        <p className="mt-6 text-warm-grey">This invitation is no longer active.</p>
      ) : (
        <form action={submitContribution.bind(null, token)} className="mt-8 space-y-4">
          <input name="name" required className="input-field" placeholder="Your name" />
          <textarea name="quote" required className="input-field h-40" placeholder="Your memory" />
          {link.requireEmail ? <input name="email" type="email" required className="input-field" /> : null}
          <button className="btn-primary" type="submit">
            Send
          </button>
        </form>
      )}
    </main>
  );
}
