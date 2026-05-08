# WhatsInMyTapWater.com (MVP Foundation)

## Project overview
WhatsInMyTapWater.com is an MVP web app foundation for showing suburb-level tap water summaries and guiding users toward relevant actions.

This current version intentionally uses **placeholder/sample data only** and does **not** connect to live utility feeds.

## Production-safety notice
- All displayed water values are explicitly sample/placeholder data.
- This app does not publish live utility lab readings in its current state.
- The app must not be used for health decisions or compliance claims.
- Keep product messaging neutral and non-alarmist.

## Tech stack
- React 18
- TypeScript
- Vite 5
- ESLint 9

## How to run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Lint:
   ```bash
   npm run lint
   ```
4. Build production bundle:
   ```bash
   npm run build
   ```

## Current MVP features
- Renders suburb cards with water quality metrics.
- Displays explicit placeholder labels on every report.
- Includes privacy/disclaimer and methodology pages.
- Adds SEO bootstrap files (`robots.txt`, `sitemap.xml`) and default social meta tags.
- Jila Water CTA is shown **only** for Brisbane/SEQ-labelled regions and uses `https://jilawater.com.au/` URLs.

## Cloudflare Pages deployment notes
1. Connect the repo in Cloudflare Pages.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Ensure SPA routing fallback is enabled via `public/_redirects` containing `/* /index.html 200`.
5. Verify `robots.txt` and `sitemap.xml` are served from the domain root.
6. After deploy, validate key routes:
   - `/`
   - `/privacy`
   - `/methodology`
   - `/report/<suburb-id>`

## Next recommended task
Replace sample suburb records with a validated ingestion pipeline that stores authoritative source timestamps and QA checks before publishing any non-placeholder values.

## Official source-data ingestion (Brisbane/SEQ bootstrap)

A safe import structure now exists for replacing placeholder data with source-backed records.

### Folder structure
- `data/templates/suburbs_postcodes.csv`
- `data/templates/water_authorities.csv`
- `data/templates/supply_zones.csv`
- `data/templates/water_quality_parameters.csv`
- `data/templates/source_references.csv`
- `data/templates/source_freshness_cadence.csv`
- `src/dataImport/types.ts`
- `src/dataImport/csvImport.ts`

### Safety rules enforced by validation
Source references must include:
- source URL
- publication date (`YYYY-MM-DD`)
- last checked date (`YYYY-MM-DD`)
- confidence level
- coverage level (`suburb`, `postcode`, `supply_zone`, `authority`, `council`, `state`)

Review status values are controlled and must be one of:
- `sample`
- `imported`
- `reviewed`
- `publishable`
- `published`

### Brisbane/SEQ authority scope for initial import templates
- Seqwater
- Urban Utilities
- Unitywater
- Queensland Health guidance
- Council/source notes where needed

### Safe import workflow
1. Keep sample values in app data until source records validate.
2. Populate source templates with official URLs and dates first.
3. Parse + validate CSV rows using `src/dataImport/csvImport.ts` (`parseCsv`, `validateSourceReferenceRecord`, and `validateWaterQualityParameterRow`).
4. Move records through status: `sample` -> `imported` -> `reviewed` -> `publishable` -> `published`.
5. `publishable`/`published` rows must include source metadata and cannot use low confidence.
6. Only publish non-sample values after validation and review are complete.

### Important guardrails
- Do not scrape live data directly in this stage.
- Do not invent water values.
- Keep beta warnings visible in UI.
- Do not publish real-looking values without URL, publication date, and confidence level.
- Keep Jila CTA logic Brisbane/SEQ-only.
## Running the Brisbane/SEQ import preview

The Brisbane/SEQ import runner (`scripts/import-brisbane-seq.ts`) performs an offline preview import from source-backed CSV template data and validates records before any publication stage. It is intended to help reviewers inspect import output safely while the app remains in sample/beta mode.

Run the preview import with:

```bash
npm run import:brisbane-seq
```

The generated staging preview JSON is written to:

- `data/staging/brisbane-seq-import.preview.json`

### Interpreting import output
- `report.hasErrors` indicates whether the import encountered validation or processing errors that require review/fix before records can move forward.
- `importFlags` indicate non-fatal conditions and review markers attached to imported rows (for example, records needing closer human QA even when parsing succeeds).

### Publication safety
- Imported records are **not** published automatically because import completion is only one step in the controlled workflow.
- Human review is required before anything can be promoted to `publishable` or `published` status.

### Warning
This command does **not** scrape live data, does **not** publish records, and must only be used with source-backed CSV data.


## Human QA before publishing water data

The Brisbane/SEQ import preview output (`data/staging/brisbane-seq-import.preview.json`) must pass human QA before any imported record can become publishable.

### Review assets
- QA checklist: `data/review/brisbane-seq-qa-checklist.md`
- Reviewed records template: `data/review/reviewed-records-template.csv`
- Rejected records template: `data/review/rejected-records-template.csv`
- Source verification checklist: `data/review/source-verification-checklist.csv`

### Lifecycle and control points
Status progression is strictly controlled:

`sample -> imported -> reviewed -> publishable -> published`

Rules enforced by process:
- Imported records cannot become `reviewed` without human verification.
- Reviewed records cannot become `publishable` unless source URL, publication date, last checked date, value, unit, coverage level, and confidence level are all present.
- Low confidence records cannot become `publishable` or `published`.
- Records with missing source URLs must remain `imported` or be moved to rejected.
- No records are automatically published.

### Minimum reviewer procedure
1. Run import preview and inspect `data/staging/brisbane-seq-import.preview.json`.
2. Verify source metadata and data points row-by-row in `data/review/source-verification-checklist.csv`.
3. Move successful rows to `data/review/reviewed-records-template.csv` with reviewer/date fields completed.
4. Move failed rows to `data/review/rejected-records-template.csv` with explicit rejection reasons.
5. Only after manual approval may records move from `publishable` to `published`.

### Example row policy
Example rows in review templates are placeholders for Brisbane/SEQ QA workflow demonstration only. They are not official water values and must not be auto-published.

## Validating reviewed water data before publishing

Run automated validation for Brisbane/SEQ QA review CSVs before any publish workflow step:

```bash
npm run validate:review-records
```

- **PASS** means the reviewed and rejected record templates passed lifecycle and field-level checks (required fields, date format, URL format, status constraints, and confidence gating).
- **FAIL** means one or more rows violate required validation rules. The report prints exact row numbers, field names, and issues so QA can fix them before attempting publication.
- **Human review is still required** because this script only enforces structural and lifecycle policy rules; it does not verify scientific correctness, source interpretation quality, or editorial judgement.
- **This script does not publish data**. It only validates local CSV review records and exits with success/failure status for CI or manual gating.

## CI safety checks

GitHub Actions CI runs on every pull request and on pushes to `main` as a safety gate.

It validates:
- app build health (`npm run lint` and `npm run build`)
- Brisbane/SEQ import preview checks (`npm run import:brisbane-seq`)
- human-reviewed record checks (`npm run validate:review-records`)

CI guardrails:
- does not publish or deploy data
- does not scrape live data
- does not modify production data
- does not replace human review

## Adding first source-backed Brisbane/SEQ records

Use this workflow to manually create the first 5–10 source-backed Brisbane/SEQ records without scraping, auto-publishing, or changing beta/sample UI behavior.

### 1) Record sources first
- Complete `data/sources/brisbane-seq-source-checklist.md` for Seqwater, Urban Utilities, Unitywater, Queensland Health, and any relevant council source notes.
- Capture source URL, owner, publication date, last checked date, coverage level, parameters, cadence, confidence, notes, reviewer initials, and review date before entering water records.

### 2) Update CSV templates manually
- Add source metadata into `data/templates/source_references.csv`.
- Add update cadence metadata into `data/templates/source_freshness_cadence.csv`.
- Add authority/zone/suburb mapping rows into:
  - `data/templates/water_authorities.csv`
  - `data/templates/supply_zones.csv`
  - `data/templates/suburbs_postcodes.csv`
- Add verified water parameter rows to `data/templates/water_quality_parameters.csv`.
- For first pass, keep records as `review_status=imported` until human QA is complete.
- See placeholder-only guidance in `data/examples/brisbane-seq-import-example.md`.

### 3) Run import preview
```bash
npm run import:brisbane-seq
```

### 4) Run reviewed-record validation
```bash
npm run validate:review-records
```

### 5) Keep records imported until human QA
- Imported records must remain imported until source/date/value/unit/coverage/confidence checks are completed by a human reviewer.
- Use `data/review/pre-publish-safety-checklist.md` to verify pre-publish gates.

### 6) When records may move to reviewed
Records may move from `imported` to `reviewed` only after:
- source metadata is complete,
- row-level values and units are checked against official source pages,
- confidence and coverage are set,
- reviewer initials/date are recorded.

### 7) Why records must not become publishable too early
Records must not become `publishable` until source, confidence, coverage, and review checks are complete because:
- missing metadata breaks traceability,
- low-confidence rows can mislead users,
- QA controls are required for safety and compliance,
- the app remains beta/sample-protected until sufficient safely reviewed records exist.
