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
