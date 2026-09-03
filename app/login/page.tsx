import { sendFamilyOtp, verifyFamilyOtp } from "@/lib/auth/actions";
import { BrandMark } from "@/components/brand/BrandMark";
import { PendingSubmit } from "@/components/ui/PendingSubmit";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; email?: string }>;
}) {
  const { next, email } = await searchParams;
  const destination = next ?? "/home";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <BrandMark href="/" />
      <h1 className="mt-10 font-serif text-4xl">Sign in</h1>
      <p className="mt-3 text-warm-grey">
        {email ? "Enter the 8-digit code we emailed you." : "We will email you an 8-digit code."}
      </p>
      {email ? (
        <form action={verifyFamilyOtp} className="mt-8 space-y-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="next" value={destination} />
          <label className="block text-sm">
            Code
            <input name="code" inputMode="numeric" required minLength={8} maxLength={8} className="input-field mt-2" autoComplete="one-time-code" />
          </label>
          <PendingSubmit className="btn-primary w-full" pendingLabel="Checking...">
            Continue
          </PendingSubmit>
        </form>
      ) : (
        <form action={sendFamilyOtp} className="mt-8 space-y-4">
          <label className="block text-sm">
            Email
            <input name="email" type="email" required className="input-field mt-2" />
          </label>
          <input type="hidden" name="next" value={destination} />
          <PendingSubmit className="btn-primary w-full">Send code</PendingSubmit>
        </form>
      )}
    </main>
  );
}
