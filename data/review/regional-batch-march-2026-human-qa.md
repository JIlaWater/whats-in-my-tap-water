# Regional batch March 2026 human QA instructions

This batch contains **imported candidate rows only** for Gold Coast, Logan, Redland, Scenic Rim, and Somerset.

## Required QA process
- Manually check every candidate row against the corresponding uploaded Seqwater March 2026 PDF.
- Confirm value fields, units, sample counts, and source page references before any status progression.
- No row may move to `reviewed` until all checks are complete and documented.
- No row may be marked `publishable` or `published` in this stage.
- If a source PDF is missing, unreadable, or unclear for any row, keep `review_status=imported` and mark reviewer notes as `needs follow-up`.

## Safety constraints
- Do not publish values publicly from this batch.
- Do not alter app display gates while this batch is in imported QA state.
