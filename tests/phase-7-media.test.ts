import { describe, expect, it } from "vitest";
import { detectThreat, isAllowedUpload, processHeicOrFail } from "@/lib/media/pipeline";
import { canPublishAsset } from "@/lib/platform/media-state";

const EICAR = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";

describe("media pipeline", () => {
  it("quarantines the EICAR test file and never marks it ready", () => {
    const result = detectThreat(Buffer.from(EICAR));
    expect(result.status).toBe("quarantined");
    expect(canPublishAsset(result.status)).toBe(false);
  });

  it("rejects svg, html and archives", () => {
    expect(isAllowedUpload("image/svg+xml", "photo.svg")).toBe(false);
    expect(isAllowedUpload("text/html", "photo.html")).toBe(false);
    expect(isAllowedUpload("application/zip", "photos.zip")).toBe(false);
    expect(isAllowedUpload("image/jpeg", "photo.jpg")).toBe(true);
    expect(isAllowedUpload("image/heic", "IMG_0001.HEIC")).toBe(true);
  });

  it("fails closed when HEIC cannot be decoded", () => {
    const result = processHeicOrFail(Buffer.from("not-a-heic"));
    expect(result.status).toBe("failed");
    expect(result.message).toMatch(/iPhone photo/i);
  });
});
