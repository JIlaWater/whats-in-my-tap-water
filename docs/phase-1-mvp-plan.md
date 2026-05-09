# Phase 1 MVP Plan

## Current repo observations
- Stack: React 18 + TypeScript + Vite + ESLint.
- Single-page app with in-file lookup/report rendering in `src/App.tsx`.
- Existing SEQ suburb coverage map and reviewed-vs-placeholder status model.
- Source-backed workflow docs and CSV pipelines are present.
- No dedicated test runner script exists in `package.json`.

## Main gaps
- Data model uses legacy labels (`sample/reviewed`) instead of required confidence/coverage/freshness enums.
- Report UI does not consistently show full source metadata fields.
- Jila CTA is currently always shown and not audience-sensitive enough.
- No formal SEO helper layer for index/noindex decisioning and metadata.
- No lead payload/attribution utility for webhook-safe handoff.

## Files likely to change
- `src/dataModels.ts`
- `src/coverageMap.ts`
- `src/seedData.ts`
- `src/App.tsx`
- `src/styles.css`
- `README.md`
- `package.json`
- New helpers: `src/seo.ts`, `src/lead.ts`, `src/attribution.ts`, tests

## Build/test commands discovered
- `npm run lint`
- `npm run build`
- `npm run import:brisbane-seq`
- `npm run validate:review-records`

## MVP acceptance criteria
- Lookup supports suburb/postcode search and graceful unknown handling.
- Report includes confidence, coverage, freshness, source, disclaimer and practical advice.
- No fabricated exact local values shown without source metadata.
- SE QLD-specific CTA messaging and softer non-SEQ fallback.
- SEO helpers produce title/description/canonical/robots and schema payload.
- Lead payload builder includes UTM/click IDs and env-backed destination.

## Not in this PR
- No live ingestion automation from external utilities.
- No Australia-wide complete suburb coverage.
- No production webhook secret provisioning.

## Risks and assumptions
- Assumes March 2026 reviewed draft datasets remain authority-level only.
- Assumes single-page architecture remains for this phase (no full Next.js migration).
- Assumes manual QA process stays the source-of-truth gate for publishable values.
