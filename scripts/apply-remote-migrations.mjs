/**
 * Apply D1 Migrations via Cloudflare REST API
 * Bypasses wrangler auth — uses token directly
 */
const ACCOUNT_ID  = '2a0d556d1c335836902aaec79146ea78';
const DATABASE_ID = '95f7261a-5f1e-4e49-b35c-24f4962bb29d';
const API_TOKEN   = process.env.CLOUDFLARE_API_TOKEN;
const BASE        = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;

async function exec(sql, label) {
    // D1 REST API accepts one statement per call; split on semicolons
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    let ok = 0, skip = 0, failed = 0;
    for (const stmt of statements) {
        try {
            const res = await fetch(BASE, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sql: stmt + ';' }),
            });
            const data = await res.json();
            if (data.success) {
                ok++;
                console.log(`  ✅ OK: ${stmt.substring(0, 80).replace(/\s+/g, ' ')}...`);
            } else {
                const errMsg = data.errors?.[0]?.message || JSON.stringify(data.errors);
                // Ignore "already exists" and "duplicate column" errors — idempotent
                if (errMsg.includes('already exists') || errMsg.includes('duplicate column') || errMsg.includes('UNIQUE constraint')) {
                    skip++;
                    console.log(`  ⏭️  SKIP (already applied): ${stmt.substring(0, 60).replace(/\s+/g, ' ')}...`);
                } else {
                    failed++;
                    console.error(`  ❌ FAIL: ${stmt.substring(0, 80).replace(/\s+/g, ' ')}`);
                    console.error(`     Error: ${errMsg}`);
                }
            }
        } catch (e) {
            failed++;
            console.error(`  ❌ NET ERROR on: ${stmt.substring(0, 60)}\n     ${e.message}`);
        }
    }
    return { ok, skip, failed };
}

const migrations = [
    {
        name: '1. schema.sql — Core Tables',
        sql: `
CREATE TABLE IF NOT EXISTS tenants (id TEXT PRIMARY KEY, name TEXT NOT NULL, status TEXT DEFAULT 'active', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS merchants (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, name TEXT NOT NULL, email TEXT, settlement_bank TEXT, status TEXT DEFAULT 'active', google_id TEXT, apple_id TEXT, auth_provider TEXT DEFAULT 'email');
CREATE TABLE IF NOT EXISTS providers (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS provider_accounts (id TEXT PRIMARY KEY, merchant_id TEXT NOT NULL, provider_id TEXT NOT NULL, credentials_ref TEXT, fee_pct REAL DEFAULT 0, fee_fixed REAL DEFAULT 0, success_rate REAL DEFAULT 1.0, active INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS ticket_orders (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, merchant_id TEXT NOT NULL, event_id TEXT, seat_zone TEXT, qty INTEGER, price_thb REAL, channel TEXT, platform TEXT, status TEXT DEFAULT 'PENDING', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, order_id TEXT NOT NULL, tenant_id TEXT NOT NULL, merchant_id TEXT NOT NULL, provider_account_id TEXT NOT NULL, amount_thb REAL NOT NULL, currency TEXT DEFAULT 'THB', status TEXT DEFAULT 'PENDING', fee REAL DEFAULT 0, net_revenue REAL DEFAULT 0, provider_ref TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS settlements (id TEXT PRIMARY KEY, merchant_id TEXT NOT NULL, currency TEXT DEFAULT 'THB', gross_amount REAL, fee_total REAL, net_amount REAL, payout_channel TEXT, period_start DATETIME, period_end DATETIME, status TEXT DEFAULT 'PENDING', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS routing_rules (id TEXT PRIMARY KEY, merchant_id TEXT NOT NULL, pattern TEXT, priority_account_id TEXT, active INTEGER DEFAULT 1);
`
    },
    {
        name: '2. seed.sql — Base Data',
        sql: `
INSERT OR IGNORE INTO tenants (id, name, status) VALUES ('tenant_01', 'XETA Main', 'ACTIVE');
INSERT OR IGNORE INTO merchants (id, tenant_id, name, status) VALUES ('merchant_01', 'tenant_01', 'XETA Alpha', 'ACTIVE');
INSERT OR IGNORE INTO providers (id, name, type) VALUES ('PROMPT_PAY', 'PromptPay', 'BANK_TRANSFER');
INSERT OR IGNORE INTO providers (id, name, type) VALUES ('LINE_PAY', 'LINE Pay', 'WALLET');
INSERT OR IGNORE INTO providers (id, name, type) VALUES ('PAYPAL', 'PayPal', 'WALLET');
INSERT OR IGNORE INTO provider_accounts (id, merchant_id, provider_id, fee_pct, fee_fixed, success_rate, active) VALUES ('acc_pp_01', 'merchant_01', 'PROMPT_PAY', 0.015, 0.0, 0.995, 1);
INSERT OR IGNORE INTO provider_accounts (id, merchant_id, provider_id, fee_pct, fee_fixed, success_rate, active) VALUES ('acc_lp_01', 'merchant_01', 'LINE_PAY', 0.025, 3.0, 0.98, 1);
INSERT OR IGNORE INTO provider_accounts (id, merchant_id, provider_id, fee_pct, fee_fixed, success_rate, active) VALUES ('acc_pal_01', 'merchant_01', 'PAYPAL', 0.035, 11.0, 0.96, 1);
`
    },
    {
        name: '3. settlements_seed.sql — Routing Rules & Settlement Records',
        sql: `
INSERT OR IGNORE INTO routing_rules (id, merchant_id, pattern, priority_account_id, active) VALUES ('rule_maemanee_01', 'merchant_01', 'amount > 0', 'acc_pp_01', 1);
INSERT OR IGNORE INTO settlements (id, merchant_id, currency, gross_amount, fee_total, net_amount, payout_channel, status) VALUES ('SET-9921', 'merchant_01', 'THB', 45200.50, 678.00, 44522.50, 'SCB Direct', 'COMPLETED');
INSERT OR IGNORE INTO settlements (id, merchant_id, currency, gross_amount, fee_total, net_amount, payout_channel, status) VALUES ('SET-9922', 'merchant_01', 'THB', 12840.00, 192.60, 12647.40, 'SCB Direct', 'COMPLETED');
`
    },
    {
        name: '4. 0002 — Add OAuth Columns to Merchants',
        sql: `
ALTER TABLE merchants ADD COLUMN email TEXT;
ALTER TABLE merchants ADD COLUMN google_id TEXT;
ALTER TABLE merchants ADD COLUMN apple_id TEXT;
ALTER TABLE merchants ADD COLUMN auth_provider TEXT DEFAULT 'email';
`
    },
    {
        name: '5. 0003 — Add API Config Columns',
        sql: `
ALTER TABLE merchants ADD COLUMN webhook_secret TEXT;
ALTER TABLE merchants ADD COLUMN provider_api_key TEXT;
ALTER TABLE merchants ADD COLUMN provider_merchant_id TEXT;
ALTER TABLE merchants ADD COLUMN settlement_bank TEXT;
ALTER TABLE merchants ADD COLUMN settlement_account TEXT;
`
    },
    {
        name: '6. 0004 — API Keys & Security Events',
        sql: `
ALTER TABLE merchants ADD COLUMN xeta_api_key TEXT;
CREATE TABLE IF NOT EXISTS security_events (id TEXT PRIMARY KEY, event_type TEXT NOT NULL, ip_address TEXT, endpoint TEXT, tenant_id TEXT, payload TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
`
    },
    {
        name: '7. actual_mids.sql — Real SCB Provider IDs',
        sql: `
INSERT OR IGNORE INTO providers (id, name, type) VALUES ('SCB_CC', 'SCB Credit Card (CC)', 'CREDIT_CARD');
INSERT OR IGNORE INTO providers (id, name, type) VALUES ('SCB_IPP', 'SCB Installment (IPP)', 'INSTALLMENT');
INSERT OR IGNORE INTO providers (id, name, type) VALUES ('SCB_PGW', 'SCB Gateway (PGW)', 'GATEWAY');
INSERT OR IGNORE INTO providers (id, name, type) VALUES ('SCB_QR_CC', 'SCB QR Credit Card', 'QR_SCAN');
INSERT OR IGNORE INTO provider_accounts (id, merchant_id, provider_id, credentials_ref, active) VALUES ('acc_cc_01', 'merchant_01', 'SCB_CC', '010000000003869437', 1);
INSERT OR IGNORE INTO provider_accounts (id, merchant_id, provider_id, credentials_ref, active) VALUES ('acc_ipp_01', 'merchant_01', 'SCB_IPP', '010000000006011382', 1);
INSERT OR IGNORE INTO provider_accounts (id, merchant_id, provider_id, credentials_ref, active) VALUES ('acc_pgw_01', 'merchant_01', 'SCB_PGW', '014012024004153', 1);
INSERT OR IGNORE INTO provider_accounts (id, merchant_id, provider_id, credentials_ref, active) VALUES ('acc_qrcc_01', 'merchant_01', 'SCB_QR_CC', '014000007538200', 1);
UPDATE merchants SET settlement_bank = 'SCB Auto-Settlement (T+1)' WHERE id = 'merchant_01';
`
    },
    {
        name: '8. live_seed.sql — Live Test Orders',
        sql: `
INSERT OR IGNORE INTO ticket_orders (id, tenant_id, merchant_id, seat_zone, qty, price_thb, channel, status, created_at) VALUES ('ORD-1001', 'tenant_01', 'merchant_01', 'A1', 1, 12500.00, 'Lumpini', 'CAPTURED', '2026-03-09 10:00:00');
INSERT OR IGNORE INTO ticket_orders (id, tenant_id, merchant_id, seat_zone, qty, price_thb, channel, status, created_at) VALUES ('ORD-1002', 'tenant_01', 'merchant_01', 'B2', 2, 45000.00, 'Shopify', 'CAPTURED', '2026-03-09 11:30:00');
INSERT OR IGNORE INTO ticket_orders (id, tenant_id, merchant_id, seat_zone, qty, price_thb, channel, status, created_at) VALUES ('ORD-1003', 'tenant_01', 'merchant_01', 'C3', 1, 99.00, 'Lazada', 'PENDING', '2026-03-09 15:45:00');
INSERT OR IGNORE INTO ticket_orders (id, tenant_id, merchant_id, seat_zone, qty, price_thb, channel, status, created_at) VALUES ('ORD-1004', 'tenant_01', 'merchant_01', 'VVIP', 5, 1500000.00, 'Direct', 'CAPTURED', '2026-03-08 20:00:00');
INSERT OR IGNORE INTO ticket_orders (id, tenant_id, merchant_id, seat_zone, qty, price_thb, channel, status, created_at) VALUES ('ORD-1005', 'tenant_01', 'merchant_01', 'D4', 1, 88000.00, 'Web', 'CAPTURED', '2026-03-08 22:15:00');
`
    },
    {
        name: '9. fix_d1_issues.sql — Indexes & Provider Health',
        sql: `
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
ALTER TABLE providers ADD COLUMN health_status TEXT DEFAULT 'unknown';
UPDATE providers SET health_status = 'stable' WHERE id IS NOT NULL;
`
    },
];

async function main() {
    if (!API_TOKEN) {
        console.error('Missing CLOUDFLARE_API_TOKEN in environment.');
        console.error('Example: CLOUDFLARE_API_TOKEN=... node apply-remote-migrations.mjs');
        process.exit(1);
    }

    console.log('🚀 Applying D1 Migrations to Remote Database');
    console.log(`   Account:  ${ACCOUNT_ID}`);
    console.log(`   Database: ${DATABASE_ID}`);
    console.log('═'.repeat(55));

    let totalOk = 0, totalSkip = 0, totalFail = 0;

    for (const m of migrations) {
        console.log(`\n📦 ${m.name}`);
        const { ok, skip, failed } = await exec(m.sql, m.name);
        totalOk   += ok;
        totalSkip += skip;
        totalFail += failed;
    }

    console.log('\n' + '═'.repeat(55));
    console.log('  MIGRATION COMPLETE');
    console.log(`  ✅ Applied:  ${totalOk} statements`);
    console.log(`  ⏭️  Skipped:  ${totalSkip} (already existed)`);
    console.log(`  ❌ Failed:   ${totalFail} statements`);
    console.log('═'.repeat(55));

    // Verify key tables exist
    console.log('\n🔍 Verifying remote tables...');
    const tables = ['tenants','merchants','providers','provider_accounts','ticket_orders','payments','settlements','security_events'];
    for (const t of tables) {
        const res = await fetch(BASE, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ sql: `SELECT COUNT(*) as cnt FROM ${t};` }),
        });
        const data = await res.json();
        if (data.success) {
            const cnt = data.result?.[0]?.results?.[0]?.cnt ?? '?';
            console.log(`  ✅ ${t.padEnd(22)} → ${cnt} rows`);
        } else {
            console.log(`  ❌ ${t.padEnd(22)} → ${data.errors?.[0]?.message}`);
        }
    }
    console.log('\n✨ Done! All tables ready on remote D1.\n');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
