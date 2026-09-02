import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/platform/store";

export async function PUT(request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { assetId } = await params;
  const asset = store.media.get(assetId);
  if (!asset) return NextResponse.json({ error: "Unknown upload." }, { status: 404 });
  const bytes = new Uint8Array(await request.arrayBuffer());
  asset.originalBytes = bytes;
  store.originals.set(asset.originalKey ?? assetId, bytes);
  try {
    store.setAssetStatus(assetId, "uploaded");
  } catch {
    asset.status = "uploaded";
  }
  return NextResponse.json({ ok: true });
}
