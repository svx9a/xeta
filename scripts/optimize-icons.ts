import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { optimize } from 'svgo';

const SOURCE_DIR = '/Users/stevejohn/Downloads/xetanext_dashboard_icon_pack';
const OUT_DIR = path.join(process.cwd(), 'components', 'assets', 'icons');
const SIZES = [16, 24, 32, 48, 64, 128];
const FORMATS = ['png', 'webp'] as const;

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function baseName(file: string) {
  const name = path.basename(file).replace(/\.(svg|png|gif)$/i, '');
  return name.replace(/(_|\s)+(\d+|hover|animated)$/i, '').replace(/_/g, '-');
}

function pickSources(files: string[]) {
  const map: Record<string, { svg?: string; png?: string }> = {};
  files.forEach(f => {
    const base = baseName(f);
    if (!map[base]) map[base] = {};
    if (f.endsWith('.svg')) map[base].svg = f;
    else if (f.endsWith('.png')) {
      const prev = map[base].png;
      if (!prev || /_128\.png$/.test(f)) map[base].png = f;
    }
  });
  return map;
}

async function writeSvgOptimized(src: string, dest: string) {
  const svg = fs.readFileSync(src, 'utf8');
  const res = optimize(svg, { multipass: true });
  fs.writeFileSync(dest, res.data);
}

async function rasterize(src: string, outBase: string) {
  for (const size of SIZES) {
    for (const fmt of FORMATS) {
      const outPath = `${outBase}-${size}.${fmt}`;
      const pipeline = sharp(src.endsWith('.svg') ? Buffer.from(fs.readFileSync(src)) : src);
      const img = pipeline.resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } });
      if (fmt === 'png') {
        await img.png({ compressionLevel: 9 }).toFile(outPath);
      } else {
        await img.webp({ quality: 80 }).toFile(outPath);
      }
    }
  }
}

function kebab(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function main() {
  ensureDir(OUT_DIR);
  const all = fs.readdirSync(SOURCE_DIR).map(f => path.join(SOURCE_DIR, f)).filter(f => /\.(svg|png)$/i.test(f));
  const sources = pickSources(all);
  const doc: string[] = [];
  doc.push('# Icon Usage');
  doc.push('');
  doc.push('| Icon | Purpose | Formats | Sizes | Path |');
  doc.push('|---|---|---|---|---|');

  for (const [raw, srcs] of Object.entries(sources)) {
    const name = kebab(raw);
    const outDir = path.join(OUT_DIR, name);
    ensureDir(outDir);

    if (srcs.svg) {
      const svgDest = path.join(outDir, `${name}.svg`);
      await writeSvgOptimized(srcs.svg, svgDest);
    }
    const rasterSrc = srcs.svg || srcs.png!;
    const outBase = path.join(outDir, name);
    await rasterize(rasterSrc, outBase);

    const sizes = SIZES.join(', ');
    const formats = ['svg'].concat(Array.from(FORMATS)).join(', ');
    doc.push(`| ${name} | ${name} | ${formats} | ${sizes} | components/assets/icons/${name} |`);
  }

  const guidePath = path.join(process.cwd(), 'docs', 'icon-usage.md');
  ensureDir(path.dirname(guidePath));
  fs.writeFileSync(guidePath, doc.join('\n'));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
