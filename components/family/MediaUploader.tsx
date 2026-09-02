"use client";

import { useState } from "react";

export function MediaUploader({
  memorialId,
  kind,
}: {
  memorialId: string;
  kind: "image" | "audio" | "video";
}) {
  const [message, setMessage] = useState("");

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("Uploading to LifeMarked storage…");
    const sign = await fetch("/api/uploads/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memorialId, kind, filename: file.name, mime: file.type, size: file.size }),
    });
    const payload = (await sign.json()) as { error?: string; uploadUrl?: string; assetId?: string };
    if (!sign.ok || !payload.uploadUrl) {
      setMessage(payload.error ?? "We could not start this upload.");
      return;
    }
    await fetch(payload.uploadUrl, { method: "PUT", body: file });
    await fetch("/api/uploads/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId: payload.assetId }),
    });
    setMessage(kind === "video" ? "Preparing playback…" : "Preparing your file…");
  }

  return (
    <label className="mt-6 block">
      <span className="btn-primary inline-flex cursor-pointer">Choose file</span>
      <input type="file" className="sr-only" onChange={onChange} accept={kind === "image" ? "image/*" : kind === "audio" ? "audio/*" : "video/*"} />
      <p className="mt-3 text-sm text-warm-grey">{message}</p>
    </label>
  );
}
