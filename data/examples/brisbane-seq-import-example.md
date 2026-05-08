# Brisbane/SEQ manual CSV import example (placeholder rows only)

This example shows **how** to fill templates manually for the first 5–10 source-backed records, without using real water values in this document.

## Safety constraints
- Do not scrape data.
- Do not invent official values.
- Do not paste values without source verification.
- Keep all first-pass rows at `review_status=imported`.

## Step-by-step manual entry pattern
1. Complete source metadata in `data/sources/brisbane-seq-source-checklist.md`.
2. Add source rows to `data/templates/source_references.csv` first.
3. Add coverage/cadence rows to `data/templates/source_freshness_cadence.csv`.
4. Add supporting geography/authority links in relevant templates.
5. Add water parameter rows last, using verified manual entries and `imported` status.
6. Run import and review validation commands.

## Placeholder example rows

### `data/templates/source_references.csv`
```csv
source_id,source_name,source_owner,source_url,publication_date,last_checked_date,coverage_level,confidence_level,notes,review_status
src_seqwater_example_001,Seqwater water quality report (example),Seqwater,https://example.gov.au/source-page,YYYY-MM-DD,YYYY-MM-DD,supply_zone,high,Placeholder example row only. Replace with official source metadata.,imported
```

### `data/templates/source_freshness_cadence.csv`
```csv
cadence_id,source_id,update_cadence,data_latency_notes,last_confirmed_date,review_status
cadence_seqwater_example_001,src_seqwater_example_001,monthly,Placeholder cadence note only,YYYY-MM-DD,imported
```

### `data/templates/water_authorities.csv`
```csv
authority_id,authority_name,region_label,website_url,source_id,review_status
auth_seq_example,Seqwater,Brisbane/SEQ,https://example.gov.au/authority,src_seqwater_example_001,imported
```

### `data/templates/supply_zones.csv`
```csv
zone_id,zone_name,authority_id,council_name,source_id,review_status
zone_example_001,Example Supply Zone,auth_seq_example,Example Council,src_seqwater_example_001,imported
```

### `data/templates/suburbs_postcodes.csv`
```csv
suburb_id,suburb_name,postcode,state,authority_id,zone_id,source_id,review_status
suburb_example_001,Example Suburb,4000,QLD,auth_seq_example,zone_example_001,src_seqwater_example_001,imported
```

### `data/templates/water_quality_parameters.csv`
```csv
record_id,suburb_id,parameter_name,value,unit,sample_date,source_id,coverage_level,confidence_level,review_status,notes
wq_example_001,suburb_example_001,pH,EXAMPLE_VALUE,EXAMPLE_UNIT,YYYY-MM-DD,src_seqwater_example_001,suburb,high,imported,Placeholder row only. Use verified official value during manual entry.
```

## Manual workflow for first 5–10 records
- Repeat the pattern above for each record.
- Use unique IDs for each source and water record.
- Do not set any row to `publishable` during first import.
- Move to `reviewed` only after human QA confirms source, dates, value, unit, coverage, and confidence.
