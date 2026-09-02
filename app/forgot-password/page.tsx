import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <h1 className="font-serif text-4xl">Reset password</h1>
      <p className="mt-4 text-warm-grey">
        Family accounts sign in with an email code and do not use a password. Staff with a password
        should write to support@lifemarked.co.uk.
      </p>
      <Link href="/login" className="btn-primary mt-8">
        Back to sign in
      </Link>
    </main>
  );
}
