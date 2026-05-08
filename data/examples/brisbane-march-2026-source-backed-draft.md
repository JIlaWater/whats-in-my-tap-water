# Brisbane March 2026 Source-Backed Draft (Candidate Imported Records Only)

## Scope
This file defines a **manual data-entry draft plan only** for Brisbane (QLD) records from the uploaded official Seqwater files, with candidate records staged as `imported` only.

## Source files in scope
1. `Seqwater Water Quality Report - Brisbane - March 2026.pdf` (primary extraction source for candidate parameter rows)
2. `Seqwater Drinking Water Service Annual Report 2024-2025.pdf` (context only; not used for candidate value extraction in this draft)
3. `Seqwater Weekly Taste and Odour Results.xlsx` (future cross-check context only; not used for candidate value extraction in this draft)

## Candidate record status and safety constraints
- These rows are **candidate imported records only**.
- They are **not published**.
- **Human QA is required** before any `reviewed`/publishable status.
- PDF values must be checked against the source file before use.
- Do not scrape live data.
- Do not remove beta/sample warnings.
- Do not change app UI.
- Do not change Jila CTA logic.

## Manual extraction plan (Brisbane monthly PDF only)
1. Open `Seqwater Water Quality Report - Brisbane - March 2026.pdf`.
2. Locate Brisbane table rows for the candidate parameters:
   - Fluoride
   - Free Chlorine
   - Monochloramine
   - Total Chlorine
   - Hardness
   - pH
   - Total Dissolved Solids
   - Turbidity
   - Alkalinity Total
   - Geosmin
   - 2-Methylisoborneol / MIB
3. Manually capture only clearly visible values for each parameter:
   - `value_numeric` (if single-value form is present)
   - `min_value`, `average_value`, `max_value` (if present)
   - `number_of_samples` (if present)
   - `unit`
4. Enter rows into `data/examples/brisbane-march-2026-candidate-records.csv` with:
   - `review_status=imported`
   - `source_type=downloadable_pdf`
   - `confidence_level=medium`
   - `coverage_level=authority`
5. Keep non-visible/uncertain fields blank and add explicit `reviewer_notes`.
6. Human QA reviewer verifies each row against the source PDF before any promotion.

## Promotion gate to reviewed/publishable
A human reviewer must confirm all of the below for each row:
- Parameter name exactly matches source context.
- Numeric field(s) and unit match PDF.
- Dates (`report_month`, `last_checked_date`) are accurate.
- Coverage and confidence assignments are appropriate.
- Any ambiguous OCR/formatting is resolved via direct PDF re-check.

Until then, all rows stay at `review_status=imported`.
