-- XETA NEXT AGX9 - SOVEREIGN PAYMENT GATEWAY SCHEMA
-- 1. Tenants (Isolation Layer)
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- 2. Merchants (Business Layer)
CREATE TABLE IF NOT EXISTS merchants (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    settlement_bank TEXT,
    status TEXT DEFAULT 'active',
    google_id TEXT,
    apple_id TEXT,
    auth_provider TEXT DEFAULT 'email',
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
-- 3. Providers (Infrastructure Layer)
CREATE TABLE IF NOT EXISTS providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL -- lightning, wallet, promptpay, paypal, wise
);
-- 4. Provider Accounts (Routing Targets)
CREATE TABLE IF NOT EXISTS provider_accounts (
    id TEXT PRIMARY KEY,
    merchant_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    credentials_ref TEXT,
    -- Reference to KV key
    fee_pct REAL DEFAULT 0,
    fee_fixed REAL DEFAULT 0,
    success_rate REAL DEFAULT 1.0,
    active INTEGER DEFAULT 1,
    FOREIGN KEY (merchant_id) REFERENCES merchants(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);
-- 5. Ticket Orders (Domain Layer)
CREATE TABLE IF NOT EXISTS ticket_orders (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    merchant_id TEXT NOT NULL,
    event_id TEXT,
    seat_zone TEXT,
    qty INTEGER,
    price_thb REAL,
    channel TEXT,
    -- Lumpini, Shopify, Lazada
    platform TEXT,
    -- web, ios, android
    status TEXT DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);
-- 6. Payments (Transaction Layer)
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    merchant_id TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    amount_thb REAL NOT NULL,
    currency TEXT DEFAULT 'THB',
    status TEXT DEFAULT 'PENDING',
    fee REAL DEFAULT 0,
    net_revenue REAL DEFAULT 0,
    provider_ref TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES ticket_orders(id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (merchant_id) REFERENCES merchants(id),
    FOREIGN KEY (provider_account_id) REFERENCES provider_accounts(id)
);
-- 7. Settlements (Payout Layer)
CREATE TABLE IF NOT EXISTS settlements (
    id TEXT PRIMARY KEY,
    merchant_id TEXT NOT NULL,
    currency TEXT DEFAULT 'THB',
    gross_amount REAL,
    fee_total REAL,
    net_amount REAL,
    payout_channel TEXT,
    period_start DATETIME,
    period_end DATETIME,
    status TEXT DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);
-- 8. Routing Rules (Optimization Layer)
CREATE TABLE IF NOT EXISTS routing_rules (
    id TEXT PRIMARY KEY,
    merchant_id TEXT NOT NULL,
    pattern TEXT,
    -- e.g. amount > 10000
    priority_account_id TEXT,
    active INTEGER DEFAULT 1,
    FOREIGN KEY (merchant_id) REFERENCES merchants(id),
    FOREIGN KEY (priority_account_id) REFERENCES provider_accounts(id)
);