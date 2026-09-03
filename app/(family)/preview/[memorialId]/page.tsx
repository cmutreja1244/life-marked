import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PublicMemorial } from "@/components/memorial/PublicMemorial";
import { requireMemorialAccess } from "@/lib/auth/session";
import { store } from "@/lib/platform/store";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: { params: Promise<{ memorialId: string }> }) {
  const { memorialId } = await params;
  try {
    await requireMemorialAccess(memorialId, "view");
  } catch {
    redirect("/home");
  }
  const memorial = store.getMemorial(memorialId);
  if (!memorial) notFound();
  const snapshot = store.previewSnapshot(memorialId);
  return (
    <div>
      <p className="bg-charcoal px-5 py-3 text-center text-sm text-ivory">
        This is a private preview. It is not the QR destination.
      </p>
      <PublicMemorial snapshot={snapshot} />
    </div>
  );
}
