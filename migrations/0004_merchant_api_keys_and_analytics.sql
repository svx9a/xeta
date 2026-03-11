-- Migration 0004: Merchant API Keys and Security Analytics
ALTER TABLE merchants ADD COLUMN xeta_api_key TEXT;

CREATE TABLE security_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'TURNSTILE_FAILED', 'RATE_LIMIT_HIT', 'ZERO_TRUST_BLOCK'
    ip_address TEXT,
    endpoint TEXT,
    tenant_id TEXT,
    payload TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for analytics performance
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
CREATE INDEX idx_security_events_type ON security_events(event_type);
