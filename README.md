# What's In My Tap Water?

Viral, source-backed Australian tap-water postcode lookup focused on useful local context (not fake precision).

## Run
- `npm install`
- `npm run dev`

## Data + honesty model
- Location profiles live in `src/seedData.ts`.
- Typed entities in `src/dataModels.ts`.
- Exact value policy in `src/dataHonesty.ts` (exact values require source URL, publisher, date, coverage, confidence, value+unit).
- Source inventory: `docs/source-inventory.md`.
- Viral plan: `docs/viral-mvp-plan.md`.

## SEO rules
- High/Medium confidence rich pages can index.
- Low/unknown/thin pages default to `noindex`.

## Env vars
- `JILA_ASSESSMENT_URL`
- `JILA_ZAPIER_WEBHOOK_URL`
- `PUBLIC_SITE_URL`

If missing, UI still works with default CTA URL.
