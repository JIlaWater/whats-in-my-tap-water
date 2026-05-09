# What’s In My Tap Water? (SEQ V1)

## 1) Project overview
Static-first React/Vite lookup tool for South East Queensland suburb/postcode searches. It routes a valid location to suburb-specific or regional guidance profiles and drives qualified users to Jila Water’s free home assessment.

## 2) Hosting instructions
- Build: `npm run build`
- Output: `dist/`
- Deploy to Cloudflare Pages, Netlify, Vercel, or static hosting.

## 3) File structure
- `index.html` SEO metadata + schema
- `src/App.tsx` UI + lookup/result flow + share actions
- `src/search.ts` normalization, alias, postcode, fuzzy matching
- `src/data/seqSearchIndex.ts` SEQ_SEARCH_INDEX (routing dataset)
- `src/data/waterProfiles.ts` WATER_PROFILES
- `src/dataModels.ts` strict data contracts
- `public/robots.txt`, `public/sitemap.xml`

## 4) How SEQ_SEARCH_INDEX works
Each entry includes suburb, postcode, LGA, regionGroup, aliases, matchedProfileSlug, profileType, and routing priority.

## 5) How WATER_PROFILES works
Profiles are reusable guidance objects keyed by slug. Suburb-specific profiles: Brisbane CBD, Brisbane, South Brisbane, West End, Caboolture. All other mapped suburbs use regional guidance profiles. Fallback profile is `seq-fallback-regional`.

## 6) Data source hierarchy
1. Australia Post postcode/locality data (preferred for launch replacement)
2. Queensland Government locality/open boundary data
3. ABS Postal Area data
4. Reputable open postcode datasets only when official files are unavailable

## 7) Data limitations
This lookup uses a structured suburb/postcode index to route users to the most relevant available water-guidance profile. Suburb/postcode matching is for guidance and routing only. Water-quality guidance is regional unless marked as suburb-specific. Property-level testing is recommended for certainty.

## 8) Replacing sample data with verified data
- Import verified Australia Post + Queensland locality data into `src/data/seqSearchIndex.ts`.
- Keep `matchedProfileSlug` mapped to existing profile slugs.
- Add/adjust aliases and duplicate postcode resolution rules.

TODO before public launch: Replace sample SEQ_SEARCH_INDEX with verified Australia Post postcode/locality data and/or Queensland Government locality boundary data. Do not invent suburb/postcode combinations.

## 9) SEO notes
- Single strong indexable lookup page (no thin suburb-page spam in V1).
- JSON-LD includes WebApplication, FAQPage, Organization, LocalBusiness, Service, BreadcrumbList.
- Keep thin/low-confidence expansions as `noindex` when added in future.

## 10) Why V1 does not create hundreds of suburb pages
V1 focuses on one high-quality lookup experience to avoid thin content and unsupported claims. Dynamic result cards provide practical guidance without pretending suburb-level lab precision.

## 11) V2 roadmap
- Full verified SEQ locality dataset import pipeline.
- Add richer region-level source blocks per profile.
- Optional suburb landing pages only where source-backed unique content exists.
- Add source freshness automation + changelog.

## Testing checklist
- Suburb tests: Brisbane CBD, Brisbane, South Brisbane, West End, Caboolture, Nundah, Morningside, Wynnum, Chermside, Springfield Lakes, Ipswich, Robina, Southport, Nerang, Caloundra, Maroochydore, Noosaville, Loganholme, Cleveland, Redland Bay, Gatton, Laidley, Highfields, Toowoomba.
- Postcodes: 4000, 4101, 4170 (multi-choice), 4300, 4350, 4218, 4551.
- Unknown: 9999, fake suburb.
