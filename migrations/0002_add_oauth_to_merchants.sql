ALTER TABLE merchants ADD COLUMN email TEXT;
ALTER TABLE merchants ADD COLUMN google_id TEXT;
ALTER TABLE merchants ADD COLUMN apple_id TEXT;
ALTER TABLE merchants ADD COLUMN auth_provider TEXT DEFAULT 'email';
