import { NextResponse } from "next/server";
import JSZip from "jszip";
import { requireMemorialAccess } from "@/lib/auth/session";
import { store } from "@/lib/platform/store";

export async function GET(_request: Request, { params }: { params: Promise<{ memorialId: string }> }) {
  const { memorialId } = await params;
  await requireMemorialAccess(memorialId, "manage");
  const memorial = store.getMemorial(memorialId);
  if (!memorial) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const zip = new JSZip();
  zip.file(
    "manifest.json",
    JSON.stringify(
      {
        memorial_export_version: 1,
        fullName: memorial.fullName,
        publicToken: memorial.publicToken,
      },
      null,
      2,
    ),
  );
  const originals = zip.folder("originals");
  for (const asset of store.media.values()) {
    if (asset.memorialId !== memorialId) continue;
    const data = asset.originalBytes ?? (asset.originalKey ? store.originals.get(asset.originalKey) : undefined);
    if (data) originals?.file(`${asset.id}-${asset.kind}`, data);
  }
  const body = await zip.generateAsync({ type: "uint8array" });
  return new NextResponse(Buffer.from(body), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${memorial.publicToken}-originals.zip"`,
    },
  });
}

export async function POST(_request: Request, { params }: { params: Promise<{ memorialId: string }> }) {
  const { memorialId } = await params;
  const { session } = await requireMemorialAccess(memorialId, "manage");
  store.enqueueExport(memorialId, session.user.id);
  return NextResponse.json({ ok: true });
}
