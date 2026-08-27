import { writeFileSync } from "fs";
import sharp from "sharp";

const source = "public/favicon.png";
const sizes = [16, 32, 48];
const pngs = [];

for (const size of sizes) {
  pngs.push(
    await sharp(source)
      .resize(size, size, {
        fit: "contain",
        background: { r: 29, g: 29, b: 27, alpha: 1 },
      })
      .png()
      .toBuffer(),
  );
}

const headerSize = 6;
const entrySize = 16;
let offset = headerSize + entrySize * pngs.length;
const entries = [];

for (const png of pngs) {
  const meta = await sharp(png).metadata();
  entries.push({
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    bytes: png.length,
    offset,
  });
  offset += png.length;
}

const buf = Buffer.alloc(offset);
buf.writeUInt16LE(0, 0);
buf.writeUInt16LE(1, 2);
buf.writeUInt16LE(pngs.length, 4);

let cursor = 6;
for (const entry of entries) {
  buf.writeUInt8(entry.width >= 256 ? 0 : entry.width, cursor);
  buf.writeUInt8(entry.height >= 256 ? 0 : entry.height, cursor + 1);
  buf.writeUInt8(0, cursor + 2);
  buf.writeUInt8(0, cursor + 3);
  buf.writeUInt16LE(1, cursor + 4);
  buf.writeUInt16LE(32, cursor + 6);
  buf.writeUInt32LE(entry.bytes, cursor + 8);
  buf.writeUInt32LE(entry.offset, cursor + 12);
  cursor += 16;
}

for (const png of pngs) {
  png.copy(buf, cursor);
  cursor += png.length;
}

writeFileSync("app/favicon.ico", buf);
writeFileSync("public/favicon.ico", buf);
