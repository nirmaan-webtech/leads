# Nirmaan AI Lead Hunter

India-wide prospecting dashboard on Cloudflare Workers + D1.

## Discovery
- Primary: OpenStreetMap Overpass with three public endpoints and timeout/error failover.
- Fallback: Photon geocoding/search API when Overpass endpoints are unavailable.
- Rotates through configured Indian city bounding boxes; deduplicates by OSM object ID.
- Public map coverage is incomplete and does not prove that a business is currently trading.

## Verification and qualification
- Website contact emails are extracted from homepage HTML when publicly exposed.
- Email check validates syntax and checks whether the domain publishes MX records. It does not verify a mailbox or deliverability.
- Indian mobile number check validates number format only; it does not call the number or prove ownership/activity.
- Activity score is based on available public listing/contact/site signals and is explicitly marked unverified.
- Lead confidence and opportunity scores are separate estimates, not proof of revenue or buying intent.

## Website checks
- Homepage HTTP response, HTTPS, title, meta description, viewport meta, H1, responsive CSS media-query heuristic.
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
