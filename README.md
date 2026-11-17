# Nirmaan AI Lead Hunter

India-wide business discovery and website opportunity research dashboard.

## Stack
- Cloudflare Workers (API + dashboard)
- Cloudflare D1 (persistent data)
- No third-party scraping of Google Maps, Instagram or Facebook. Discovery adapters must use permitted APIs and respect their terms.

## Current status
- D1 schema provisioned.
- Worker deployment configured independently from other account Workers.
- Discovery requires a configured, permitted provider. The app must never fabricate leads or claim 50 verified leads when fewer are actually qualified.

## Deploy
Worker script: `nirmaan-ai-lead-hunter`
Binding: `DB` -> D1 database `nirmaan-ai-lead-hunter`
Cron: `0 */2 * * *` (two-hour cadence; discovery stays disabled until provider credentials are configured).

## First login
The first visit to `/setup` provisions the initial admin account. Setup is one-time and requires a strong password. Save the password securely.
