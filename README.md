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
See also: `data/templates/README.md` for the Brisbane/SEQ bootstrap import workflow and safety guardrails.

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
