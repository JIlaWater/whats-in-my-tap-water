# Brisbane/SEQ official source checklist (manual entry workflow)

Use this checklist before adding the first 5–10 Brisbane/SEQ records to CSV templates. This document is for **manual verification only**.

## Rules for first records
- Use official source pages only.
- Do not scrape data.
- Do not invent values.
- Do not publish values from this checklist directly.
- Record source metadata first, then add rows to CSV templates with `review_status=imported`.

## Official Brisbane/SEQ starting source set
Populate the blank reviewer/date/notes fields during manual QA.

| Source URL | Source owner | Report/document title | Publication/update cadence | Available parameters | Geographic coverage | Intended CSV template usage | Confidence considerations | Reviewer initials | Review date | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| https://www.seqwater.com.au/water-quality-report | Seqwater | Seqwater Water Quality Report | Monthly report cycle (confirm exact publication date per release) | Bulk drinking water quality parameters (health + aesthetic), reporting zones (confirm exact parameter list from the current report issue) | South East Queensland bulk water / reporting zones | `source_references.csv`, `source_freshness_cadence.csv`, `water_quality_parameters.csv`, `supply_zones.csv` | Treat as high confidence only when publication date + zone context are captured; downgrade confidence if zone mapping is unclear for a suburb-level row |  |  | Starting point for monthly source-backed parameter capture; no direct publish from this checklist |
| https://www.seqwater.com.au/water-quality | Seqwater | Seqwater Water Quality | Multi-document hub page; cadence varies by linked report type (local-area reports, weekly taste/odour context, annual reports) | Water quality reporting links, local-area report links, annual service report links, PFAS-related links | South East Queensland (hub page with mixed linked coverage) | `source_references.csv`, `source_freshness_cadence.csv` | Use as a navigation/source-discovery anchor; confidence depends on the specific linked report used for row-level values |  |  | Capture exact linked document title/version used for each imported data point |
| https://www.seqwater.com.au/pfas-and-drinking-water | Seqwater | Seqwater PFAS and Drinking Water | Update cadence per Seqwater PFAS communications/sampling updates | PFAS guidance and PFAS sampling results by water treatment plant | South East Queensland treatment-plant level | `source_references.csv`, `water_quality_parameters.csv`, `supply_zones.csv` | Do not infer suburb-level values from plant-level PFAS context without explicit mapping evidence; use medium confidence until mapping is reviewer-verified |  |  | Useful for PFAS/PFHxS/PFOA-related fields and context notes |
| https://www.seqwater.com.au/taste-and-odour | Seqwater | Seqwater Taste and Odour | Weekly/contextual updates (verify actual posting date on each referenced update) | Taste and odour information, MIB/Geosmin context, SEQ Water Grid source context | South East Queensland (grid/system context) | `source_references.csv`, `source_freshness_cadence.csv`, optional `water_quality_parameters.csv` when a parameter/value is explicitly reported | Primarily contextual unless explicit numeric values are present; avoid translating narrative advisories into numeric rows without clear source support |  |  | Use for explanatory/source context; keep notes explicit when no numeric data is extracted |
| https://www.unitywater.com/about-us/our-business/water-quality/water-quality-testing-and-reports | Unitywater | Unitywater Water Quality Testing and Reports | Periodic performance reporting cadence per Unitywater publication schedule | Drinking water quality performance reporting, testing regime context, supply-scheme-level reporting links | Unitywater service area within SEQ | `source_references.csv`, `source_freshness_cadence.csv`, `water_quality_parameters.csv`, `supply_zones.csv` | Confidence depends on matching supply scheme to suburb/postcode and capturing publication timestamp from the exact report used |  |  | Use official Unitywater report documents linked from this page for row-level records |
| https://www.health.qld.gov.au/public-health/industry-environment/environment-land-water/water/quality/drinking | Queensland Health | Queensland Health Drinking Water | Regulatory/guidance updates as published by Queensland Health | Drinking water regulation, advisory, and health guidance (policy/regulatory context) | Queensland (statewide guidance) | `source_references.csv`, optional supporting context for `water_authorities.csv` and QA notes | Usually authoritative for regulatory context; not necessarily a direct numeric measurement source for suburb-level parameter rows |  |  | Use for compliance/guidance context and reviewer rationale, not for invented quantitative values |

---

## Completion criteria for first 5–10 records
Before moving any row beyond `imported`, ensure each selected source entry above has:
1. A valid source URL.
2. Publication/update cadence noted and specific report publication date captured in CSV templates.
3. Available parameters + geographic coverage documented.
4. Intended CSV template usage identified.
5. Confidence considerations documented.
6. Reviewer initials and review date filled.
7. Notes captured for any mapping assumptions or unresolved ambiguities.

Rows missing any of the above must remain `imported` or be rejected during QA.
