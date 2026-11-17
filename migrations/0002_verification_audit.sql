-- Additive verification and audit fields for existing deployments.
ALTER TABLE businesses ADD COLUMN phone_verification TEXT;
ALTER TABLE businesses ADD COLUMN email_verification TEXT;
ALTER TABLE businesses ADD COLUMN activity_status TEXT;
ALTER TABLE businesses ADD COLUMN activity_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE businesses ADD COLUMN qualification_reason TEXT;
ALTER TABLE businesses ADD COLUMN source_urls_json TEXT;
ALTER TABLE website_audits ADD COLUMN links_checked INTEGER NOT NULL DEFAULT 0;
ALTER TABLE website_audits ADD COLUMN broken_links_json TEXT;
ALTER TABLE website_audits ADD COLUMN forms_detected INTEGER NOT NULL DEFAULT 0;
ALTER TABLE website_audits ADD COLUMN contact_emails_json TEXT;
ALTER TABLE website_audits ADD COLUMN mobile_heuristic_score INTEGER;
ALTER TABLE website_audits ADD COLUMN audit_score INTEGER;
CREATE INDEX IF NOT EXISTS idx_business_activity ON businesses(activity_status,activity_score);
CREATE INDEX IF NOT EXISTS idx_business_contact ON businesses(phone_verification,email_verification);
