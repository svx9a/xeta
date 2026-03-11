import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

type OptimizeResult = {
  file: string;
  beforeBytes: number;
  afterBytes: number;
  mode: "palette" | "truecolor" | "skipped";
};

type Effect = "none" | "medium" | "geometric";

function formatBytes(bytes: number) {
  const units = ["B", "KiB", "MiB", "GiB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

function parseEffect(argv: string[]): Effect {
  const arg = argv.find((a) => a.startsWith("--effect="));
  if (!arg) return "none";
  const value = arg.slice("--effect=".length).toLowerCase();
  if (value === "none") return "none";
  if (value === "medium") return "medium";
  if (value === "geometric") return "geometric";
  throw new Error(`Unknown --effect value: ${value} (expected none|medium)`);
}

function trianglePatternSvg(width: number, height: number) {
  const tile = 24;
  const light = "rgba(255,255,255,0.06)";
  const dark = "rgba(0,0,0,0.035)";
  return Buffer.from(
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="tri" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse">
      <path d="M0 ${tile} L${tile / 2} 0 L${tile} ${tile} Z" fill="${light}"/>
      <path d="M0 0 L${tile / 2} ${tile} L${tile} 0 Z" fill="${dark}"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#tri)"/>
</svg>`,
  );
}

async function applyEffect(input: Buffer, effect: Effect): Promise<Buffer> {
  if (effect === "none") return input;

  const base = sharp(input, { failOn: "none" }).ensureAlpha();

  if (effect === "medium") {
    return base
      .gamma(1.03)
      .modulate({ brightness: 1.03, saturation: 1.08 })
      .sharpen(0.8, 0.25, 1.1)
      .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
      .toBuffer();
  }

  const meta = await base.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const pattern = width > 0 && height > 0 ? trianglePatternSvg(width, height) : null;

  const felt = base
    .gamma(1.02)
    .modulate({ brightness: 1.015, saturation: 0.96 })
    .sharpen(0.9, 0.25, 1.2);

  const withPattern = pattern
    ? felt.composite([{ input: pattern, blend: "soft-light" }])
    : felt;

  return withPattern.png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true }).toBuffer();
}

async function optimizePngBuffer(input: Buffer) {
  const base = sharp(input, { failOn: "none" }).ensureAlpha();

  const truecolor = await base
    .clone()
    .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
    .toBuffer();

  const palette = await base
    .clone()
    .png({
      compressionLevel: 9,
      effort: 10,
      adaptiveFiltering: true,
      palette: true,
      quality: 100,
      dither: 0,
    })
    .toBuffer();

  if (palette.length <= truecolor.length) return { buffer: palette, mode: "palette" as const };
  return { buffer: truecolor, mode: "truecolor" as const };
}

async function main() {
  const root = process.cwd();
  const iconsDir = path.join(root, "public", "icons");
  const effect = parseEffect(process.argv.slice(2));

  if (!fs.existsSync(iconsDir)) {
    throw new Error(`Missing icons directory: ${iconsDir}`);
  }

  const pngFiles = fs
    .readdirSync(iconsDir)
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .map((f) => path.join(iconsDir, f));

  if (pngFiles.length === 0) {
    console.log(`No PNGs found in ${iconsDir}`);
    return;
  }

  const results: OptimizeResult[] = [];

  for (const filePath of pngFiles) {
    const before = fs.readFileSync(filePath);
    const beforeBytes = before.length;

    const effected = await applyEffect(before, effect);
    const { buffer: after, mode } = await optimizePngBuffer(effected);
    const afterBytes = after.length;

    if (afterBytes < beforeBytes) {
      fs.writeFileSync(filePath, after);
      results.push({ file: path.relative(root, filePath), beforeBytes, afterBytes, mode });
    } else {
      results.push({ file: path.relative(root, filePath), beforeBytes, afterBytes: beforeBytes, mode: "skipped" });
    }
  }

  const totalBefore = results.reduce((sum, r) => sum + r.beforeBytes, 0);
  const totalAfter = results.reduce((sum, r) => sum + r.afterBytes, 0);

  results.sort((a, b) => (b.beforeBytes - b.afterBytes) - (a.beforeBytes - a.afterBytes));
  console.log(`Optimized ${results.length} icon(s) in public/icons (effect: ${effect})`);
  for (const r of results) {
    const delta = r.beforeBytes - r.afterBytes;
    const percent = r.beforeBytes === 0 ? 0 : (delta / r.beforeBytes) * 100;
    const mode = r.mode === "skipped" ? "skip" : r.mode;
    console.log(
      `${r.file}  ${formatBytes(r.beforeBytes)} -> ${formatBytes(r.afterBytes)}  (${mode}, saved ${formatBytes(
        Math.max(0, delta),
      )}, ${Math.max(0, percent).toFixed(1)}%)`,
    );
  }
  console.log(`Total: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)} (saved ${formatBytes(totalBefore - totalAfter)})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
