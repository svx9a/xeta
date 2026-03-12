import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const targets = [
  ".npm_local",
  ".bin_temp",
  ".tmp",
  "dist",
  path.join(".wrangler", "dry-run"),
];

for (const rel of targets) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) continue;
  fs.rmSync(p, { recursive: true, force: true });
  process.stdout.write(`removed ${rel}\n`);
}

