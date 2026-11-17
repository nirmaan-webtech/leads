CREATE TABLE IF NOT EXISTS businesses (
 id TEXT PRIMARY KEY,
 dedupe_key TEXT NOT NULL UNIQUE,
 name TEXT NOT NULL,
 category TEXT,
 city TEXT,
 state TEXT,
 country TEXT NOT NULL DEFAULT 'India',
 address TEXT,
 phone TEXT,
 email TEXT,
 website_url TEXT,
 domain TEXT,
 google_maps_url TEXT,
 instagram_url TEXT,
 facebook_url TEXT,
 discovery_source TEXT,
 activity_evidence TEXT,
 website_status TEXT NOT NULL DEFAULT 'unverified',
 qualification_status TEXT NOT NULL DEFAULT 'pending',
 confidence_score INTEGER NOT NULL DEFAULT 0,
 opportunity_score INTEGER NOT NULL DEFAULT 0,
 first_seen_at TEXT NOT NULL,
 last_verified_at TEXT,
 raw_evidence_json TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_business_status ON businesses(qualification_status, opportunity_score);
CREATE INDEX IF NOT EXISTS idx_business_location ON businesses(state, city);
CREATE TABLE IF NOT EXISTS website_audits (
 id TEXT PRIMARY KEY,
 business_id TEXT NOT NULL,
 checked_at TEXT NOT NULL,
 requested_url TEXT,
 final_url TEXT,
 http_status INTEGER,
 ssl_valid INTEGER,
 mobile_test_status TEXT,
 desktop_test_status TEXT,
 performance_mobile REAL,
 performance_desktop REAL,
 broken_links_count INTEGER,
 form_test_status TEXT,
 findings_json TEXT NOT NULL DEFAULT '[]',
 evidence_json TEXT NOT NULL DEFAULT '{}',
 FOREIGN KEY(business_id) REFERENCES businesses(id)
);
CREATE INDEX IF NOT EXISTS idx_audit_business ON website_audits(business_id, checked_at);
CREATE TABLE IF NOT EXISTS research_runs (
 id TEXT PRIMARY KEY,
 started_at TEXT NOT NULL,
 completed_at TEXT,
 country TEXT NOT NULL DEFAULT 'India',
 target_count INTEGER NOT NULL DEFAULT 50,
 discovered_count INTEGER NOT NULL DEFAULT 0,
 qualified_count INTEGER NOT NULL DEFAULT 0,
 duplicate_count INTEGER NOT NULL DEFAULT 0,
 failed_count INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT 'queued',
 notes TEXT
);
CREATE TABLE IF NOT EXISTS outreach_drafts (
 id TEXT PRIMARY KEY,
 business_id TEXT NOT NULL,
 channel TEXT NOT NULL,
 subject TEXT,
 message TEXT NOT NULL,
 strategy TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 status TEXT NOT NULL DEFAULT 'draft',
 FOREIGN KEY(business_id) REFERENCES businesses(id)
);
CREATE INDEX IF NOT EXISTS idx_outreach_business ON outreach_drafts(business_id, status);
CREATE TABLE IF NOT EXISTS app_users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 username TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS app_settings (
 key TEXT PRIMARY KEY,
 value TEXT NOT NULL,
 updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
