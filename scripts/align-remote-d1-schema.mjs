#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const DB_NAME = process.env.XETA_D1_NAME || "xetapay-db";

function runWrangler(args) {
  const out = execFileSync("npx", ["wrangler", ...args], { encoding: "utf8" });
  return out;
}

function parseWranglerJson(mixedOutput) {
  const idx = mixedOutput.indexOf("[");
  if (idx === -1) throw new Error("Could not find JSON in wrangler output");
  return JSON.parse(mixedOutput.slice(idx));
}

function d1(sql) {
  const out = runWrangler(["d1", "execute", DB_NAME, "--remote", "--command", sql]);
  const json = parseWranglerJson(out);
  const first = json?.[0];
  if (!first?.success) {
    const msg = first?.errors?.[0]?.message || "Unknown D1 error";
    throw new Error(msg);
  }
  return first?.results ?? [];
}

function tableExists(name) {
  const rows = d1(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='${name.replace(/'/g, "''")}';`,
  );
  return rows.length > 0;
}

function columns(table) {
  const rows = d1(`PRAGMA table_info(${table});`);
  return new Set(rows.map((r) => r.name));
}

function addColumnIfMissing(table, colDef) {
  const colName = colDef.trim().split(/\s+/)[0];
  const cols = columns(table);
  if (cols.has(colName)) return false;
  d1(`ALTER TABLE ${table} ADD COLUMN ${colDef};`);
  return true;
}

function ensure() {
  console.log(`🔧 Aligning remote D1 schema for DB: ${DB_NAME}`);

  if (!tableExists("merchants")) throw new Error("Expected table merchants to exist");
  if (!tableExists("tenants")) throw new Error("Expected table tenants to exist");

  const merchantAdds = [
    "tenant_id TEXT",
    "settlement_bank TEXT",
    "settlement_account TEXT",
    "webhook_secret TEXT",
    "provider_api_key TEXT",
    "provider_merchant_id TEXT",
    "google_id TEXT",
    "apple_id TEXT",
    "auth_provider TEXT DEFAULT 'email'",
    "xeta_api_key TEXT",
  ];

  let changed = 0;
  for (const def of merchantAdds) {
    if (addColumnIfMissing("merchants", def)) {
      changed++;
      console.log(`  ✅ merchants: added ${def}`);
    }
  }

  if (!tableExists("security_events")) {
    d1(`
      CREATE TABLE security_events (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        ip_address TEXT,
        endpoint TEXT,
        tenant_id TEXT,
        payload TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    d1(`CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);`);
    d1(`CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);`);
    console.log("  ✅ created security_events + indexes");
    changed++;
  }

  // Ensure a default tenant exists and backfill any missing merchant.tenant_id
  d1(`INSERT OR IGNORE INTO tenants (id, name, status) VALUES ('TENANT-001', 'Default Tenant', 'active');`);
  try {
    d1(`UPDATE merchants SET tenant_id = 'TENANT-001' WHERE tenant_id IS NULL OR tenant_id = '';`);
  } catch {
    // If tenant_id was just added and SQLite is catching up, ignore; next run will apply.
  }

  console.log(changed ? `✨ Done (changes: ${changed})` : "✨ Done (no changes needed)");
}

try {
  ensure();
} catch (e) {
  console.error("❌ Schema alignment failed:", e?.message || e);
  process.exit(1);
}

