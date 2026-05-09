# Brisbane March 2026 QA Review Instructions

Use this guide to manually verify each candidate imported row from `data/imports/brisbane-march-2026-candidate-records.csv` against the Seqwater source PDF (`Seqwater Water Quality Report - Brisbane - 2026-03.pdf`).

## Source page mapping

- **Page 1:** fluoride, free chlorine, monochloramine, total chlorine
- **Page 2:** hardness, pH, total dissolved solids
- **Page 3:** turbidity, alkalinity total, geosmin, 2-methylisoborneol (MIB)

## Manual review workflow

1. Open `data/review/brisbane-march-2026-reviewed-draft.csv`.
2. For each row, check source PDF values for parameter name, values, units, sample count, and source page.
3. Fill reviewer initials and review date (`YYYY-MM-DD`) only after checking the row.
4. Keep `review_status` as `imported` until the row is manually confirmed by human QA.
5. Only after manual verification can a row move to `reviewed`.
6. If any value is unclear, set notes to `needs follow-up` or move the record to `data/review/brisbane-march-2026-rejected-draft.csv` with a rejection reason.

## Mandatory rules

- Candidate rows stay `imported` until checked manually.
- Only manually verified rows can move to `reviewed`.
- Do **not** mark any record `publishable` or `published` yet.
- If a value is unclear, mark `needs follow-up` or reject it.
- Keep beta/sample warnings on the live site.
