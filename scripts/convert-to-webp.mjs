import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import { join, parse } from "path";

const assetsDir = "C:\\Users\\chira\\.cursor\\projects\\d-Cursor-Projects-life-marked\\assets";
const publicDir = join(process.cwd(), "public", "images");
const margaretDir = join(publicDir, "margaret");

const assetMap = {
  "hero-margaret-memorial.png": "hero-margaret-memorial.webp",
  "margaret-memorial-close.png": "margaret-memorial-close.webp",
  "bench-memorial-v2.png": "bench-memorial.webp",
  "garden-memorial.png": "garden-memorial.webp",
  "partner-showroom.png": "partner-showroom.webp",
  "finish-steel.png": "finish-steel.webp",
  "finish-bronze.png": "finish-bronze.webp",
  "finish-dark.png": "finish-dark.webp",
  "hero-memorial.png": "headstone-memorial.webp",
  "og-image.png": "og-image.webp",
};

async function toWebp(input, output, width) {
  let pipeline = sharp(input);
  if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true });
  await pipeline.webp({ quality: 82 }).toFile(output);
  console.log(`  ${output}`);
}

await mkdir(margaretDir, { recursive: true });

for (const [src, dest] of Object.entries(assetMap)) {
  await toWebp(join(assetsDir, src), join(publicDir, dest), dest.includes("finish") ? 1400 : 2000);
}

const margaretFiles = ["portrait", "wedding", "family-1", "travel", "candid"];
for (const name of margaretFiles) {
  const png = join(publicDir, "margaret", `${name}.png`);
  const webp = join(margaretDir, `${name}.webp`);
  try {
    await toWebp(png, webp, 1200);
  } catch {
    console.warn(`Skip ${name}`);
  }
}

console.log("Done.");
