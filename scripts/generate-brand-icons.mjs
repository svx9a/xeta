#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

function colorDistanceSq(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

async function keyOutBackgroundToAlpha(inputPath, { tolerance, samplePoint = [0, 0] }) {
  const base = sharp(inputPath, { failOn: "none" }).ensureAlpha();
  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });

  const [sx, sy] = samplePoint;
  const idx = (sy * info.width + sx) * 4;
  const bg = [data[idx], data[idx + 1], data[idx + 2]];

  const tolSq = tolerance * tolerance;
  for (let i = 0; i < data.length; i += 4) {
    const c = [data[i], data[i + 1], data[i + 2]];
    if (colorDistanceSq(c, bg) <= tolSq) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
}

async function buildWordmark({ src, out }) {
  // Background is nearly-uniform in the source (corner sample works well).
  const keyed = await keyOutBackgroundToAlpha(src, { tolerance: 28, samplePoint: [5, 5] });
  await keyed
    .trim({ threshold: 10 })
    .resize({ width: 720, withoutEnlargement: true })
    .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
    .toFile(out);
}

async function buildMark({ src, out }) {
  // Cube has a near-black background (sample corner), key it out and trim.
  const keyed = await keyOutBackgroundToAlpha(src, { tolerance: 22, samplePoint: [2, 2] });
  await keyed
    .trim({ threshold: 12 })
    .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
    .toFile(out);
}

async function buildFavicons({ markPngPath }) {
  const root = process.cwd();
  const publicDir = path.join(root, "public");

  const mark = sharp(markPngPath, { failOn: "none" }).ensureAlpha();

  // Transparent favicons
  await mark
    .clone()
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
    .toFile(path.join(publicDir, "favicon.png"));

  await mark
    .clone()
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
    .toFile(path.join(publicDir, "favicon-32x32.png"));

  await mark
    .clone()
    .resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
    .toFile(path.join(publicDir, "favicon-16x16.png"));

  // Apple touch icon: add a light background so it looks good on iOS.
  const size = 180;
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">\n` +
      `<rect width="100%" height="100%" rx="36" ry="36" fill="#fdfaf3"/>\n` +
      `</svg>`,
  );

  const markBuf = await mark
    .clone()
    .resize(132, 132, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp(bg)
    .composite([{ input: markBuf, gravity: "center" }])
    .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
    .toFile(path.join(publicDir, "apple-touch-icon.png"));
}

async function main() {
  const root = process.cwd();
  const iconsDir = path.join(root, "public", "icons");
  const wordmarkSrc = path.join(iconsDir, "xetapay-logo.png");
  const markSrc = path.join(iconsDir, "logo-cube.png");

  const wordmarkOut = path.join(iconsDir, "xeta-wordmark.png");
  const markOut = path.join(iconsDir, "xeta-mark.png");

  if (!fs.existsSync(wordmarkSrc)) {
    throw new Error(`Missing source wordmark: ${path.relative(root, wordmarkSrc)}`);
  }
  if (!fs.existsSync(markSrc)) {
    throw new Error(`Missing source mark: ${path.relative(root, markSrc)}`);
  }

  await buildWordmark({ src: wordmarkSrc, out: wordmarkOut });
  await buildMark({ src: markSrc, out: markOut });
  await buildFavicons({ markPngPath: markOut });

  console.log(`✅ Generated:\n- ${path.relative(root, wordmarkOut)}\n- ${path.relative(root, markOut)}`);
  console.log(
    `✅ Updated:\n- public/favicon.png\n- public/favicon-32x32.png\n- public/favicon-16x16.png\n- public/apple-touch-icon.png`,
  );
  console.log("Tip: run `npm run icons:optimize:public` to shrink PNG size (optional).");
}

main().catch((err) => {
  console.error("❌", err?.message || err);
  process.exit(1);
});
