import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { InfoTip } from "@/components/ui/InfoTip";
import { requireMemorialAccess } from "@/lib/auth/session";
import { EDITOR_TIPS } from "@/lib/family/tips";
import { selfPublish, submitMemorial } from "@/lib/family/actions";
import { familyStatusLabel } from "@/lib/platform/lifecycle";
import { store } from "@/lib/platform/store";

const NAV = [
  ["overview", "Overview", EDITOR_TIPS.overview],
  ["about", "About them", EDITOR_TIPS.about],
  ["story", "Their story", EDITOR_TIPS.story],
  ["timeline", "Life moments", EDITOR_TIPS.timeline],
  ["favourites", "Favourites", EDITOR_TIPS.favourites],
  ["gallery", "Photographs", EDITOR_TIPS.gallery],
  ["memories", "Memories", EDITOR_TIPS.memories],
  ["voice", "Voice", EDITOR_TIPS.voice],
  ["video", "Video", EDITOR_TIPS.video],
  ["places", "Places", EDITOR_TIPS.places],
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
    redirect("/home");
  }
  const memorial = store.getMemorial(memorialId);
  if (!memorial) notFound();
  const canEdit = role === "owner" || role === "editor" || isAdmin;
  const isSelfPublish = memorial.publishingMode === "self_publish";
  const publishAction = isSelfPublish
    ? selfPublish.bind(null, memorialId)
    : submitMemorial.bind(null, memorialId);
  const publishLabel = isSelfPublish ? "Update live page" : "Send for review";
  const publishConfirm = isSelfPublish
    ? "This copies the current draft onto the public page. Visitors and QR scans will see it. Continue?"
    : "This sends the draft to LifeMarked. Visitors will not see it until we make a version live. Continue?";

  return (
    <div className="mx-auto grid max-w-[76rem] gap-8 px-5 pb-36 pt-8 md:grid-cols-[14rem_1fr] md:px-10">
      <aside>
        <p className="font-serif text-xl">{memorial.fullName || "Memorial"}</p>
        <p className="mt-2 text-sm text-warm-grey">{familyStatusLabel(memorial.status)}</p>
        {isAdmin ? (
          <p className="mt-3">
            <Link href={`/admin/memorials/${memorialId}`} className="text-link">
              This memorial in admin
            </Link>
          </p>
        ) : null}
        <nav className="mt-6 hidden flex-col gap-2 md:flex" aria-label="Editor">
          {NAV.map(([slug, label, tip]) => (
            <span key={slug} className="flex items-center gap-2">
              <Link href={`/memorials/${memorialId}/${slug}`} className="text-link">
                {label}
              </Link>
              <InfoTip text={tip} label={`About ${label}`} align="end" />
            </span>
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
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-warm bg-stone">
        <div className="mx-auto flex max-w-[76rem] flex-wrap items-center justify-end gap-3 px-5 py-3 md:px-10">
          <Link href={`/preview/${memorialId}`} className="btn-secondary">
            Preview
          </Link>
          {canEdit ? (
            <form action={publishAction}>
              <ConfirmSubmit message={publishConfirm}>{publishLabel}</ConfirmSubmit>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
