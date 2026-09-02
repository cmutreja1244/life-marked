import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireMemorialAccess } from "@/lib/auth/session";
import { store } from "@/lib/platform/store";

const NAV = [
  ["overview", "Overview"],
  ["about", "About them"],
  ["story", "Their story"],
  ["timeline", "Life moments"],
  ["favourites", "Favourites"],
  ["gallery", "Photographs"],
  ["memories", "Memories"],
  ["voice", "Voice"],
  ["video", "Video"],
  ["places", "Places"],
  ["sections", "Sections"],
  ["family", "Family and privacy"],
  ["publish", "Publish"],
] as const;

export default async function MemorialEditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ memorialId: string }>;
}) {
  const { memorialId } = await params;
  try {
    await requireMemorialAccess(memorialId, "view");
  } catch {
    redirect("/login");
  }
  const memorial = store.getMemorial(memorialId);
  if (!memorial) notFound();

  return (
    <div className="mx-auto grid max-w-[76rem] gap-8 px-5 py-8 md:grid-cols-[14rem_1fr] md:px-10">
      <aside>
        <p className="font-serif text-xl">{memorial.fullName || "Memorial"}</p>
        <nav className="mt-6 hidden flex-col gap-2 md:flex" aria-label="Editor">
          {NAV.map(([slug, label]) => (
            <Link key={slug} href={`/memorials/${memorialId}/${slug}`} className="text-link">
              {label}
            </Link>
          ))}
          <Link href={`/preview/${memorialId}`} className="text-link mt-4">
            Preview
          </Link>
        </nav>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 md:hidden">
          {NAV.map(([slug, label]) => (
            <Link
              key={slug}
              href={`/memorials/${memorialId}/${slug}`}
              className="min-h-12 whitespace-nowrap rounded-full border border-border-warm px-4 py-2 text-sm"
            >
              {label}
            </Link>
          ))}
        </div>
      </aside>
      <div>{children}</div>
    </div>
  );
}
