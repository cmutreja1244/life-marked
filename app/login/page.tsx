import { sendFamilyOtp, verifyFamilyOtp } from "@/lib/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; email?: string }>;
}) {
  const { next, email } = await searchParams;
  const destination = next ?? "/home";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <h1 className="font-serif text-4xl">Sign in</h1>
      <p className="mt-3 text-warm-grey">
        {email ? "Enter the 6-digit code we sent." : "We will send a 6-digit code to your email."}
      </p>
      {email ? (
        <form action={verifyFamilyOtp} className="mt-8 space-y-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="next" value={destination} />
          <label className="block text-sm">
            Code
            <input name="code" inputMode="numeric" required minLength={6} maxLength={6} className="input-field mt-2" />
          </label>
          <button className="btn-primary w-full" type="submit">
            Continue
          </button>
        </form>
      ) : (
        <form action={sendFamilyOtp} className="mt-8 space-y-4">
          <label className="block text-sm">
            Email
            <input name="email" type="email" required className="input-field mt-2" />
          </label>
          <input type="hidden" name="next" value={destination} />
          <button className="btn-primary w-full" type="submit">
            Send code
          </button>
        </form>
      )}
    </main>
  );
}
