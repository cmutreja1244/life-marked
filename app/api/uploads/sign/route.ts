import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { isAllowedUpload } from "@/lib/media/pipeline";
import { store } from "@/lib/platform/store";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const schema = z.object({
  memorialId: z.string().uuid(),
  kind: z.enum(["image", "audio", "video", "caption"]),
  filename: z.string().min(1),
  mime: z.string().min(1),
  size: z.number().positive(),
});

export async function POST(request: Request) {
  const limited = await rateLimit("upload-sign", clientIp(request), 20, 10 * 60 * 1000);
  if (!limited.success) {
    return NextResponse.json({ error: "Please wait before uploading again." }, { status: 429 });
  }
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  if (!isAllowedUpload(parsed.data.mime, parsed.data.filename)) {
    return NextResponse.json({ error: "That file type cannot be uploaded." }, { status: 400 });
  }
  const membership = store.membership(parsed.data.memorialId, session.user.id);
  if (!session.user.isAdmin && membership?.role !== "owner" && membership?.role !== "editor") {
    return NextResponse.json({ error: "You cannot upload to this memorial." }, { status: 403 });
  }
  const asset = store.createAsset({
    memorialId: parsed.data.memorialId,
    kind: parsed.data.kind,
    mime: parsed.data.mime,
    filename: parsed.data.filename,
  });
  return NextResponse.json({
    assetId: asset.id,
    uploadUrl: `/api/uploads/put/${asset.id}`,
  });
}
