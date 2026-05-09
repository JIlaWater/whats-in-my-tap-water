# Moreton March 2026 Human QA Requirements

All rows in `data/imports/moreton-march-2026-candidate-records.csv` are **candidate imported rows only**.

## Mandatory human QA before any status changes

A human reviewer must manually check every field for every row against:

- `data/source-files/seqwater/Seqwater Water Quality Report - Moreton - 2026-03.pdf`

This includes:

- Parameter names
- Min / average / max values
- Units
- Number of samples

## Status restrictions

Until complete human QA is finished:

- Keep `review_status=imported`
- Do not mark rows as reviewed
- Do not mark rows as publishable
- Do not mark rows as published
- Do not expose Moreton values publicly

## Follow-up handling

If any value cannot be confidently verified from the uploaded PDF, leave the value blank and keep reviewer notes indicating follow-up is required.
