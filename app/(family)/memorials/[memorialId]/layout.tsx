import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { requireMemorialAccess } from "@/lib/auth/session";
import { selfPublish, submitMemorial } from "@/lib/family/actions";
import { familyStatusLabel } from "@/lib/platform/lifecycle";
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
] as const;

export default async function MemorialEditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ memorialId: string }>;
}) {
  const { memorialId } = await params;
  let role: "owner" | "editor" | "viewer" | null = null;
  let isAdmin = false;
  try {
    const access = await requireMemorialAccess(memorialId, "view");
    role = access.role;
    isAdmin = access.session.user.isAdmin;
  } catch {
    redirect("/login");
  }
  const memorial = store.getMemorial(memorialId);
  if (!memorial) notFound();
  const canEdit = role === "owner" || role === "editor" || isAdmin;
  const publishAction =
    memorial.publishingMode === "self_publish"
      ? selfPublish.bind(null, memorialId)
      : submitMemorial.bind(null, memorialId);
  const publishLabel =
    memorial.publishingMode === "self_publish" ? "Update live page" : "Send for review";

  return (
    <div className="mx-auto grid max-w-[76rem] gap-8 px-5 pb-28 pt-8 md:grid-cols-[14rem_1fr] md:px-10">
      <aside>
        <p className="font-serif text-xl">{memorial.fullName || "Memorial"}</p>
        <p className="mt-2 text-sm text-warm-grey">{familyStatusLabel(memorial.status)}</p>
        <nav className="mt-6 hidden flex-col gap-2 md:flex" aria-label="Editor">
          {NAV.map(([slug, label]) => (
            <Link key={slug} href={`/memorials/${memorialId}/${slug}`} className="text-link">
              {label}
            </Link>
          ))}
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
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-warm bg-ivory/95">
        <div className="mx-auto flex max-w-[76rem] flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-10">
          <p className="text-sm text-warm-grey">Preview shows your latest draft. It is not what QR scans see.</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/preview/${memorialId}`} className="btn-secondary">
              Preview
            </Link>
            {canEdit ? (
              <form action={publishAction}>
                <ConfirmSubmit message="Ready to send this draft? Continue?">{publishLabel}</ConfirmSubmit>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
