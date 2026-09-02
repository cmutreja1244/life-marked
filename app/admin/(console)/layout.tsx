import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user.isAdmin) redirect("/admin/login");
  if (session.aal !== "aal2") redirect("/admin/login/mfa");

  return (
    <div className="min-h-screen bg-stone text-charcoal">
      <header className="border-b border-border-warm bg-ivory">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-serif text-xl">
            LifeMarked admin
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/admin/memorials">Memorials</Link>
            <Link href="/admin/review">Review</Link>
            <Link href="/admin/media">Media</Link>
            <Link href="/admin/partners">Partners</Link>
            <Link href="/admin/packages">Packages</Link>
            <Link href="/admin/reports">Reports</Link>
            <Link href="/admin/settings">Settings</Link>
            <form action={signOut}>
              <button type="submit" className="text-link">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-[90rem] px-6 py-8">{children}</div>
    </div>
  );
}
