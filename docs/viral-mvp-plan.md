# Viral MVP Plan

## Current problems
- Thin request-form-first UX.
- Too many unknown fallbacks.
- Missing share/citation mechanics.

## Data available
- SEQ authority PDFs and import/review logs.
- Existing Brisbane/Moreton source-backed profile scaffolding.

## Unused data now addressed
- Regional import/review signals are surfaced as `Being reviewed` instead of dead pages.

## Target journey
Search suburb/postcode → instant local snapshot → share/cite/compare → CTA.

## Viral moments
- Copy social post.
- Cite-this-report snippet.
- Compare cards.
- Print/save.

## Data tiering
1. Exact sourced values only with full metadata.
2. Authority/regional context when exact unavailable.
3. Guidance layer for every result.
4. Unknown only when no usable context.

## SEO rules
- High/Medium + rich report = index.
- Low/unknown/thin = noindex.

## Implementation
- Typed profile model and source labels.
- Search matching + no unrelated report policy.
- Rich report card with confidence/coverage/freshness.

## Not solved in this PR
- Fully automated national ingestion.
- All AU councils.
