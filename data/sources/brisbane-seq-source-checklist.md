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


## Source type handling

Use the following source-type rules when recording official Brisbane/SEQ references.

### `downloadable_pdf`
- **source_url:** Record the direct PDF file URL when possible. If only a landing page is available, record the landing page URL and include the PDF filename in notes.
- **publication date:** Record the publication date printed on the PDF (or the release date shown on the official page if the PDF has no explicit date).
- **last_checked_date:** Record the date the reviewer last opened the source and confirmed it is still the current official version.
- **downloadable:** Set as `yes` because the source artifact is a downloadable file.
- **manual entry notes:** Note the report title/version, zone context, and any table-to-field mapping decisions used during entry.

### `official_html_page`
- **source_url:** Record the canonical official HTML page URL (for example, the Seqwater PFAS page) that contains the table.
- **publication date:** Record the date shown on-page for the relevant update/table section; if no explicit publication date exists, capture the page update wording in notes and leave publication handling to QA policy.
- **last_checked_date:** Record the exact date the reviewer last loaded the page and verified that the table content/structure had not changed unexpectedly.
- **downloadable:** Set as `no` when no clean downloadable report is available for the needed table data.
- **manual entry notes:** Document the exact table section used, source owner, reviewer initials, and any interpretation limits.
- **Why manual review is required:** HTML tables can change structure, labels, or context without a versioned file trail. Every extracted value must be manually reviewed before use to avoid mis-mapped or stale data.

### `annual_report_pdf`
- **source_url:** Record the direct annual report PDF URL (or the official landing page + file title when direct links are temporary).
- **publication date:** Record the annual report issue/publication date shown in the document.
- **last_checked_date:** Record the reviewer check date used to confirm the annual version is still current.
- **downloadable:** Set as `yes`.
- **manual entry notes:** Note section/page references and whether values are annual summaries rather than monthly measurements.

### `guidance_page`
- **source_url:** Record the official guidance/advisory page URL from the responsible authority.
- **publication date:** Record the official page update/publication date shown by the publisher.
- **last_checked_date:** Record when the reviewer last verified the guidance remained current.
- **downloadable:** Set as `no` unless the guidance page includes the exact downloadable document used.
- **manual entry notes:** Capture how the guidance is being used (context only vs row-level evidence) and any restrictions on numeric extraction.



### Seqwater Weekly Taste and Odour Results (`downloadable_xlsx`)
Use this section when the official weekly taste/odour source is provided as an Excel workbook (for example `seqwater_taste_odour_results_day_20260508.xlsx`).

| Field | Value to capture |
|---|---|
| source owner | Seqwater |
| source type | downloadable_xlsx |
| file name |  |
| source URL |  |
| report/download title |  |
| publication date or report date |  |
| last checked date |  |
| geographic coverage |  |
| available parameters |  |
| update cadence | weekly (if confirmed by source) |
| confidence considerations |  |
| reviewer initials |  |
| review date |  |
| notes |  |

**Manual safety requirements for XLSX sources**
- Record the exact workbook filename and URL before using any values.
- Keep all imported rows in `review_status=imported` until spreadsheet cells are manually reviewed.
- Do not auto-publish Excel-derived values.
- Do not scrape or auto-ingest external spreadsheet links.
---


## Uploaded local source files

These local artifacts are available for manual reviewer reference and source traceability only. Values must still be manually checked before any row can move to `reviewed` status.

### Brisbane March 2026 Monthly Water Quality Report PDF
- **local repo path:** `data/source-files/seqwater/Seqwater Water Quality Report - Brisbane - 2026-03.pdf`
- **source owner:** Seqwater
- **source type:** downloadable_pdf
- **intended use:** Primary March 2026 Brisbane monthly parameter/value extraction and source metadata capture for CSV templates.
- **review requirement:** Reviewer must confirm publication date, parameter mapping, units, and zone context before lifecycle promotion.
- **manual-check note:** Values must be manually checked against the PDF tables before setting any row to `reviewed`.

### Other SEQ monthly water quality report PDFs
- **local repo path:**
  - `data/source-files/seqwater/Seqwater Water Quality Report - Gold Coast - 2026-03.pdf`
  - `data/source-files/seqwater/Seqwater Water Quality Report - Logan - 2026-03.pdf`
  - `data/source-files/seqwater/Seqwater Water Quality Report - Moreton - 2026-03.pdf`
  - `data/source-files/seqwater/Seqwater Water Quality Report - Redland - 2026-03.pdf`
  - `data/source-files/seqwater/Seqwater Water Quality Report - Scenic Rim - 2026-03.pdf`
  - `data/source-files/seqwater/Seqwater Water Quality Report - Somerset - 2026-03.pdf`
  - `data/source-files/seqwater/Seqwater Water Quality Report - Sunshine Coast - 2026-03.pdf`
- **source owner:** Seqwater
- **source type:** downloadable_pdf
- **intended use:** Region-specific monthly source verification and cross-checking for SEQ zone/suburb mapping during manual import QA.
- **review requirement:** Reviewer must verify each value against the correct regional report and document mapping decisions in QA notes.
- **manual-check note:** Values must be manually checked before any imported record is marked `reviewed`.

### Seqwater Weekly Taste and Odour XLSX
- **local repo path:** `data/source-files/seqwater/seqwater_taste_odour_results_day_20260508.xlsx`
- **source owner:** Seqwater
- **source type:** downloadable_xlsx
- **intended use:** Weekly taste/odour context and any explicitly reported worksheet values used in source-backed QA records.
- **review requirement:** Reviewer must perform cell-by-cell verification for referenced values and confirm report date/source metadata before status changes.
- **manual-check note:** Spreadsheet-derived values must be manually checked before setting rows to `reviewed`.

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
