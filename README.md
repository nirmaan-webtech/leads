# Nirmaan AI Lead Hunter

India-wide prospecting dashboard on Cloudflare Workers + D1.

## Discovery
- Primary: OpenStreetMap Overpass with three public endpoints and timeout/error failover.
- Fallback: Photon reverse-geocoding with OSM tag filters when Overpass endpoints are unavailable; coverage and availability are not guaranteed.
- Rotates through configured Indian city bounding boxes; deduplicates by OSM object ID; caps newly inserted businesses at 50 per run.
- Public map coverage is incomplete and does not prove that a business is currently trading.

## Verification and qualification
- Website contact emails are extracted from homepage HTML when publicly exposed.
- Email check validates syntax and checks whether the domain publishes MX records. It does not verify a mailbox or deliverability.
- Indian mobile number check validates number format only; it does not call the number or prove ownership/activity.
- Activity score is based on available public listing/contact/site signals and is explicitly marked unverified. Qualification additionally requires a lead-worthy website condition plus contact or address evidence; it still does not prove the business is trading.
- Lead confidence and opportunity scores are separate estimates, not proof of revenue or buying intent.

## Website checks
- Homepage HTTP response (following redirects and recording the final URL), HTTPS, title, meta description, viewport meta, H1, responsive CSS media-query heuristic.
- Detects HTML forms without submitting them.
- Checks up to 10 same-origin links using HEAD requests.
- Extracts up to 10 public email strings.
- Mobile score is a markup heuristic, not a real mobile browser test. No Lighthouse/PageSpeed, visual screenshot, browser rendering, form submission, checkout test or complete site crawl.

## Automation and reporting
- Cron: `0 */2 * * *` (every two hours).
- Dashboard manual run; run status and failure notes saved in D1.
- CSV export is Excel-compatible and includes qualification/contact evidence fields.
- Outreach drafts are generated but never sent automatically.

## External integrations still required for stronger coverage
- Google Places or another licensed business data provider requires an API key and billing/terms review.
- Real browser/mobile performance testing requires a browser-rendering service/binding.
- Phone ownership/live status requires a compliant verification provider; email mailbox verification requires a deliverability provider.
- Automated alerts (email/Slack) require a configured notification destination.

## Privacy and compliance
Do not scrape Google Maps, Instagram or Facebook. Only use permitted public APIs and published business contact details. Review applicable provider terms and outreach/privacy requirements before campaigns.

## QA fixes in `fix/lead-hunter-qa`
- Provider attribution is stored on discovered records and in run summaries.
- New business inserts are capped at 50 per run.
- Photon fallback uses reverse lookups with OSM tag filters instead of searching generic words as place names.
- Website redirects are followed and the final URL is recorded.
- A lead is not marked qualified and given an outreach draft unless the website opportunity condition and minimum public contact/address evidence are both present.

These changes still require a successful live run and production smoke test. The public Photon service is rate-limited and provides no availability guarantee. The OSM-based providers share the same underlying ecosystem, not independent business databases.
