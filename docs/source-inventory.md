# Source Inventory (May 9, 2026)

| Path | Contains | Used before | Wired in this pass | Why not used (if no) | Confidence | Type |
|---|---|---:|---:|---|---|---|
| data/source-files/seqwater/*.pdf | Uploaded Seqwater regional reports (Brisbane, Moreton, Gold Coast, Logan, Redland, Scenic Rim, Somerset, Sunshine Coast) | Partial | Yes (region-backed summaries and source cards) | n/a | Medium | Regional values/context |
| data/imports/*.csv | Candidate records for multiple SEQ regions | No (UI) | Yes (coverage planning + review status) | Not direct exact display: candidate records require QA gates | Low | Candidate regional/exact |
| data/review/*.csv,*.md | Human QA + verification logs | No (UI) | Yes (review status, under-review labeling) | n/a | Medium | QA metadata |
| data/sources/official-source-links.md | Authority links catalogue | Partial | Yes | n/a | High | Source metadata |
| data/examples/*.csv,*.md | Import examples and draft mappings | No | No | Sample/draft material; not production-safe display | Low | Sample |
| src/sourceBackedData/*.ts | Existing reviewed data snapshots for Brisbane/Moreton | Partial | Yes (used as basis for reviewed profile coverage logic) | n/a | Medium | Reviewed context |
| public/images/kangaroo-water-mascot.webp, public/kangaroo-mascot.svg | Brand assets | No | Deferred | Visual refresh can use later; not required for data-honesty release | High | Marketing asset |
| docs/phase-1-mvp-plan.md | Earlier MVP notes | Yes | Superseded by viral MVP plan | historical | Medium | Planning |
