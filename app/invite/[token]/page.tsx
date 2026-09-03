import { acceptInviteAction } from "@/lib/family/actions";
import { BrandMark } from "@/components/brand/BrandMark";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const session = await getSession();
  const { token } = await params;
  if (!session) {
    redirect(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <BrandMark href="/" />
      <h1 className="mt-10 font-serif text-4xl">Join this memorial</h1>
      <p className="mt-3 text-warm-grey">You are signed in as {session.user.email}.</p>
      <form
        className="mt-8"
        action={async () => {
          "use server";
          const formData = new FormData();
          formData.set("token", token);
          const memorialId = await acceptInviteAction(formData);
          redirect(`/memorials/${memorialId}/about`);
        }}
      >
        <button className="btn-primary w-full" type="submit">
          Continue
        </button>
      </form>
    </main>
  );
}
