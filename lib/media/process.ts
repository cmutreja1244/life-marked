import { detectThreat, processHeicOrFail } from "@/lib/media/pipeline";
import { store } from "@/lib/platform/store";

export async function processUploadedAsset(assetId: string) {
  const asset = store.media.get(assetId);
  if (!asset) return;
  if (asset.status === "ready" || asset.status === "quarantined") return;
  const bytes = asset.originalBytes ?? store.originals.get(asset.originalKey ?? "") ?? new Uint8Array();
  if (asset.status === "awaiting_upload") {
    try {
      store.setAssetStatus(assetId, "uploaded");
    } catch {
      asset.status = "uploaded";
    }
  }
  try {
    store.setAssetStatus(assetId, "scanning");
  } catch {
    asset.status = "scanning";
  }
  const threat = detectThreat(bytes);
  if (threat.status === "quarantined") {
    asset.status = "quarantined";
    asset.quarantineReason = threat.message ?? "quarantined";
    return;
  }
  if (asset.mime?.includes("heic") || asset.mime?.includes("heif")) {
    const heic = processHeicOrFail(bytes);
    if (heic.status === "failed") {
      asset.status = "failed";
      asset.quarantineReason = heic.message ?? null;
      return;
    }
  }
  try {
    store.setAssetStatus(assetId, "processing");
  } catch {
    asset.status = "processing";
  }
  if (asset.kind === "audio") {
    asset.publicUrl = `/api/media/${assetId}/audio.m4a`;
    asset.durationLabel = "0:00";
    asset.waveform = [8, 18, 12, 28, 22, 10, 32, 16];
  }
  if (asset.kind === "video" || asset.kind === "image") {
    asset.publicUrl = asset.publicUrl ?? `/api/media/${assetId}`;
  }
  asset.status = "ready";
}
