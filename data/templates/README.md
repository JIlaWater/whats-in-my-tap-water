# Official data templates (Brisbane / SEQ bootstrap)

These CSV templates define the **only safe path** for replacing placeholder records in production.

## Scope for this first import phase
- Seqwater
- Urban Utilities
- Unitywater
- Queensland Health guidance
- Council/source notes where relevant

## Files
1. `suburbs_postcodes.csv`
2. `water_authorities.csv`
3. `supply_zones.csv`
4. `water_quality_parameters.csv`
5. `source_references.csv`
6. `source_freshness_cadence.csv`

## Required source metadata before publishing non-sample values
Any data row intended for `publishable` or `published` status must have:
- `source_url`
- `publication_date` (YYYY-MM-DD)
- `last_checked_date` (YYYY-MM-DD)
- `confidence_level` (`low|medium|high`)
- `coverage_level` (`suburb|postcode|supply_zone|authority|council|state`)

## Review status lifecycle
- `sample`
- `imported`
- `reviewed`
- `publishable`
- `published`

Keep all existing live values in `sample` until each record has passed validation and review.

## Important guardrails
- Do not scrape live data in this stage.
- Do not invent water values.
- Do not remove beta warnings from the app.
- Do not promote values to `publishable`/`published` unless source metadata and confidence checks pass.
