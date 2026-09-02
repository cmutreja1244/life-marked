import { ImageResponse } from "next/og";
import { lookupPublishedMemorial } from "@/lib/memorials/lookup";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await lookupPublishedMemorial({ token });
  if (result.outcome !== "ok" || result.visibility === "private") {
    return new Response("Not found", { status: 404 });
  }
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#f4f0e8",
          color: "#242422",
          padding: 64,
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase" }}>LifeMarked</div>
        <div style={{ fontSize: 64, marginTop: 24 }}>{result.snapshot.fullName}</div>
        <div style={{ fontSize: 28, marginTop: 12 }}>{result.snapshot.years}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
