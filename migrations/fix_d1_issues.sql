-- 1. Add missing index on payments.created_at (Transaction History)
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
-- 2. Add health_status to providers table with default 'unknown'
-- Note: D1 doesn't support ALTER TABLE ... ADD COLUMN ... DEFAULT directly in some versions, 
-- but it works fine for basic types.
ALTER TABLE providers
ADD COLUMN health_status TEXT DEFAULT 'unknown';
-- 3. Add health_status to existing records
UPDATE providers
SET health_status = 'stable'
WHERE id IS NOT NULL;