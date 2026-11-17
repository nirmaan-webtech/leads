-- Required by the business discovery INSERT in src/worker.js.
ALTER TABLE businesses ADD COLUMN country TEXT DEFAULT 'India';
