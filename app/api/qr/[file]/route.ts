import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { requireAdmin } from "@/lib/auth/session";
import { store } from "@/lib/platform/store";
import { qrPayload, errorCorrectionLevel } from "@/lib/platform/qr";

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return new NextResponse("Please sign in as staff.", { status: 401 });
  }
  const { file } = await params;
  const [id, ext] = file.split(/\.(svg|png|pdf)$/i);
  const memorial = store.getMemorial(id ?? "");
  if (!memorial || !ext) return new NextResponse("Not found", { status: 404 });
  const payload = qrPayload(memorial.publicToken);
  const options = { errorCorrectionLevel: errorCorrectionLevel(), margin: 4, color: { dark: "#000000", light: "#ffffff" } };

  if (ext.toLowerCase() === "svg") {
    const svg = await QRCode.toString(payload, { ...options, type: "svg" });
    return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml" } });
  }
  if (ext.toLowerCase() === "png") {
    const png = await QRCode.toBuffer(payload, { ...options, type: "png", width: 2048 });
    return new NextResponse(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
  }

  const png = await QRCode.toBuffer(payload, { ...options, type: "png", width: 1024 });
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.TimesRoman);
  const image = await pdf.embedPng(png);
  page.drawText("LifeMarked", { x: 72, y: 760, size: 18, font, color: rgb(0.14, 0.14, 0.13) });
  page.drawText(memorial.fullName || "Memorial", { x: 72, y: 730, size: 14, font });
  page.drawImage(image, { x: 147, y: 360, width: 300, height: 300 });
  page.drawText(payload, { x: 72, y: 320, size: 9, font });
  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), { headers: { "Content-Type": "application/pdf" } });
}
