"use client";

import { useRef, useState } from "react";

export function VoiceRecorder({ memorialId }: { memorialId: string }) {
  const [status, setStatus] = useState("Ready to record");
  const [preview, setPreview] = useState<string | null>(null);
  const chunks = useRef<Blob[]>([]);
  const recorder = useRef<MediaRecorder | null>(null);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
    const instance = new MediaRecorder(stream, { mimeType: mime });
    chunks.current = [];
    instance.ondataavailable = (event) => {
      if (event.data.size) chunks.current.push(event.data);
    };
    instance.onstop = () => {
      const blob = new Blob(chunks.current, { type: instance.mimeType });
      setPreview(URL.createObjectURL(blob));
      setStatus("Listen back, then upload.");
      recorder.current = instance;
      (instance as MediaRecorder & { blob?: Blob }).blob = blob;
    };
    instance.start();
    recorder.current = instance;
    setStatus("Recording…");
  }

  function stop() {
    recorder.current?.stop();
    recorder.current?.stream.getTracks().forEach((track) => track.stop());
  }

  async function upload() {
    const blob = (recorder.current as MediaRecorder & { blob?: Blob })?.blob;
    if (!blob) return;
    setStatus("Uploading to LifeMarked storage…");
    const sign = await fetch("/api/uploads/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memorialId,
        kind: "audio",
        filename: "recording.webm",
        mime: blob.type,
        size: blob.size,
      }),
    });
    const payload = (await sign.json()) as { uploadUrl?: string; assetId?: string; error?: string };
    if (!payload.uploadUrl) {
      setStatus(payload.error ?? "Upload failed.");
      return;
    }
    await fetch(payload.uploadUrl, { method: "PUT", body: blob });
    await fetch("/api/uploads/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId: payload.assetId }),
    });
    setStatus("Preparing playback…");
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={start}>
          Record
        </button>
        <button type="button" className="text-link" onClick={stop}>
          Stop
        </button>
        <button type="button" className="text-link" onClick={upload}>
          Upload this recording
        </button>
      </div>
      {preview ? <audio className="w-full" controls src={preview} /> : null}
      <p className="text-sm text-warm-grey">{status}</p>
    </div>
  );
}
