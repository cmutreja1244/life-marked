const BLOCKED_EXT = new Set(["svg", "html", "htm", "js", "exe", "zip", "gz", "rar", "7z", "php", "sh"]);
const BLOCKED_MIME = new Set([
  "image/svg+xml",
  "text/html",
  "application/javascript",
  "application/zip",
  "application/x-msdownload",
]);
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "audio/x-m4a",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "text/vtt",
]);

export const EICAR_SIGNATURE = "EICAR-STANDARD-ANTIVIRUS-TEST-FILE";

export type ScanResult = {
  status: "quarantined" | "processing" | "failed";
  engine: "clamav-stub" | "libheif-stub";
  message?: string;
  sha256?: string;
};

export function isAllowedUpload(mime: string, filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (BLOCKED_EXT.has(ext) || BLOCKED_MIME.has(mime)) return false;
  return ALLOWED_MIME.has(mime);
}

export function detectThreat(bytes: Buffer | Uint8Array): ScanResult {
  const text = Buffer.from(bytes).toString("utf8");
  if (text.includes(EICAR_SIGNATURE) || text.includes("X5O!P%@AP")) {
    return { status: "quarantined", engine: "clamav-stub", message: "Malware signature detected." };
  }
  return { status: "processing", engine: "clamav-stub" };
}

export function processHeicOrFail(bytes: Buffer | Uint8Array): ScanResult {
  const header = Buffer.from(bytes).subarray(0, 12).toString("utf8");
  if (header.includes("ftypheic") || header.includes("ftypmif1") || header.includes("ftypmsf1")) {
    return { status: "processing", engine: "libheif-stub" };
  }
  return {
    status: "failed",
    engine: "libheif-stub",
    message: "We couldn’t read this iPhone photo. Try exporting as JPEG from Photos.",
  };
}

export function checksumMatches(original: Buffer | Uint8Array, restored: Buffer | Uint8Array) {
  return Buffer.from(original).equals(Buffer.from(restored));
}
