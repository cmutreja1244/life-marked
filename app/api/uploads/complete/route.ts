import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/platform/store";
import { processUploadedAsset } from "@/lib/media/process";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const parsed = z.object({ assetId: z.string() }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const asset = store.media.get(parsed.data.assetId);
  if (!asset) return NextResponse.json({ error: "Unknown file." }, { status: 404 });
  await processUploadedAsset(asset.id);
  return NextResponse.json({ ok: true, status: store.media.get(asset.id)?.status });
}
