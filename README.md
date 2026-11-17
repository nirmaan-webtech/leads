# Nirmaan AI Lead Hunter

India-wide business prospecting dashboard on Cloudflare Workers + D1.

## Discovery engine
- Source: OpenStreetMap public data via Overpass API.
- Rotates through 20 configured Indian city bounding boxes, one city per run.
- Collects business name, category, city/state, address, publicly mapped phone/email/website/social tags, and source evidence where available.
- Deduplicates by OSM object type + ID.
- Audits up to 10 unverified homepages per run: HTTP response, HTTPS URL, title, meta description, viewport meta, H1, response size and latency.
- Creates unsent, evidence-based outreach drafts for candidates.
- Cron: `0 */2 * * *` (every two hours); dashboard also has a manual Run discovery action.

## Important limitations
- OpenStreetMap is a community map, not a business registry. A listing does not prove that a business is currently trading, successful, or generating revenue. Verify before outreach.
- Coverage depends on OpenStreetMap completeness; this is not a comprehensive all-India business directory.
- Public Overpass availability/rate limits can cause a run to fail or return fewer than 50 records.
- Website checks are basic HTTP/HTML checks. They do not perform real browser rendering, Lighthouse/PageSpeed, actual mobile viewport testing, form submissions, checkout tests, or exhaustive broken-link scans.
- Outreach drafts are not sent automatically.
- Google Maps, Instagram and Facebook are not scraped. Only contact/social tags explicitly present in OpenStreetMap are stored.
- A target of 50 is not a guarantee. The engine stores only actual returned, deduplicated records.

## Deploy
Worker: `nirmaan-ai-lead-hunter`
D1 binding: `DB` -> `nirmaan-ai-lead-hunter`
