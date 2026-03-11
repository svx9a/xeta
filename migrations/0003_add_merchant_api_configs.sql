-- Add API configuration and Webhook secrets to Merchants
ALTER TABLE merchants ADD COLUMN webhook_secret TEXT;
ALTER TABLE merchants ADD COLUMN provider_api_key TEXT;
ALTER TABLE merchants ADD COLUMN provider_merchant_id TEXT;
ALTER TABLE merchants ADD COLUMN settlement_bank TEXT;
ALTER TABLE merchants ADD COLUMN settlement_account TEXT;
