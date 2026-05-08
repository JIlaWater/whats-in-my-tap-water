# WhatsInMyTapWater.com (MVP Foundation)

## Project overview
WhatsInMyTapWater.com is an MVP web app foundation for showing suburb-level tap water summaries and guiding users toward relevant actions.

This current version intentionally uses **placeholder/sample data only** and does **not** connect to live utility feeds.

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
- Shows a safety disclaimer that no live data is being used.
- Jila Water CTA is shown **only** for Brisbane/SEQ-labelled regions.
- CTA is hidden for non-Brisbane/SEQ regions.

## How placeholder data is labelled
- Dataset source includes the label: `Placeholder/Sample Data`.
- Each record includes a note: `Sample values only. Not live, certified, or user-specific.`
- Top-of-page banner states no live water network feed is used.

## Next recommended build task
Build a validated suburb search + postcode lookup flow with region normalization and strict data-source tagging, so Brisbane/SEQ CTA gating is based on normalized geography rather than free-form labels.
