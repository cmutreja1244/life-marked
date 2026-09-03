import { submitPublicContribution } from "@/lib/contributions/actions";
import { store } from "@/lib/platform/store";
import { PendingSubmit } from "@/components/ui/PendingSubmit";

export default async function ContributionPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ sent?: string }>;
}) {
  const { token } = await params;
  const { sent } = await searchParams;
  const link = await store.getContributionLink(token);
  const invalid = !link || Boolean(link.revokedAt) || new Date(link.expiresAt).getTime() <= Date.now();

  return (
    <main className="mx-auto max-w-lg px-5 py-16">
      <h1 className="font-serif text-4xl">Share a memory</h1>
      {sent ? (
        <p className="mt-6 text-warm-grey">
          Thank you. The family will read this before it appears on the memorial.
        </p>
      ) : invalid ? (
        <p className="mt-6 text-warm-grey">This invitation is no longer active.</p>
      ) : (
        <form action={submitPublicContribution.bind(null, token)} className="mt-8 space-y-4">
          <label className="block text-sm">
            Your name
            <input name="name" required className="input-field mt-2" />
          </label>
          <label className="block text-sm">
            Your memory
            <textarea name="quote" required className="input-field mt-2 h-40" />
          </label>
          {link.requireEmail ? (
            <label className="block text-sm">
              Email
              <input name="email" type="email" required className="input-field mt-2" />
            </label>
          ) : null}
          <PendingSubmit>Send</PendingSubmit>
        </form>
      )}
    </main>
  );
}
