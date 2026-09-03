import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/actions";

export default async function FamilyLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <header className="border-b border-border-warm">
        <div className="mx-auto flex h-14 max-w-[76rem] items-center justify-between px-5 md:px-10">
          <Link href="/home" className="font-serif text-xl">
            LifeMarked
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-warm-grey sm:inline">{session.user.email}</span>
            {session.user.isAdmin ? (
              <Link href="/admin" className="text-link">
                Admin
              </Link>
            ) : null}
            <Link href="/settings" className="text-link">
              Account
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-link">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
