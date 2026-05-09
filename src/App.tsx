import { useEffect, useMemo, useState } from 'react';
import { authorities, reports, suburbMappings, suburbs, supplyZones } from './seedData';
import { seqCoverageMap, suggestedTestSuburbs } from './coverageMap';
import { getReviewedWaterData } from './sourceBackedData/getReviewedWaterData';

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedSuburbId, setSelectedSuburbId] = useState(suburbs[0]?.id ?? '');

  const matchRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suburbs.slice(0, 10);
    return suburbs.filter((s) => s.suburb.toLowerCase().includes(q) || s.postcode.includes(q));
  }, [query]);

  const exactMatch = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return undefined;
    return suburbs.find((s) => s.suburb.toLowerCase() === q || s.postcode === q);
  }, [query]);

  useEffect(() => {
    if (exactMatch) setSelectedSuburbId(exactMatch.id);
  }, [exactMatch]);

  const suburb = suburbs.find((s) => s.id === selectedSuburbId) ?? suburbs[0];
  const mapping = suburbMappings.find((m) => m.suburbId === suburb.id)!;
  const authority = authorities.find((a) => a.id === mapping.authorityId)!;
  const supplyZone = supplyZones.find((z) => z.id === mapping.supplyZoneId)!;
  const report = reports.find((r) => r.suburbId === suburb.id)!;
  const reviewedRecords = getReviewedWaterData(suburb, mapping);
  const coverage = seqCoverageMap.find((c) => c.suburb.toLowerCase() === suburb.suburb.toLowerCase() && c.postcode === suburb.postcode);

  const hasReviewed = reviewedRecords.length > 0 && coverage?.dataStatus === 'reviewed_source_backed';
  const beingReviewed = coverage?.dataStatus === 'candidate_imported' || coverage?.dataStatus === 'needs_qa';

  const copySummary = async () => {
    const link = `${window.location.origin}/`;
    const summary = hasReviewed
      ? `${suburb.suburb} (${suburb.postcode})\nRegion: ${coverage?.displayRegionName}\nData status: reviewed source-backed authority-level data\nReport month: March 2026\nNot individual tap testing\n${link}`
      : `${suburb.suburb} (${suburb.postcode})\nData status: sample placeholder only\nNo reviewed source-backed data is displayed for this suburb yet.\nWant your area added next? Request this suburb.\n${link}`;
    try { await navigator.clipboard.writeText(summary); alert('Summary copied.'); } catch { alert('Clipboard unavailable. Please copy manually from the report.'); }
  };

  return <main className="layout">
    <p className="topBanner"><strong>BETA DATA NOTICE</strong> — Reviewed SEQ authority-level data is available for selected suburbs. Other areas may show sample placeholders. Not individual tap testing.</p>
    <header className="hero card"><h1>What’s Really In Your Tap Water?</h1><p className="betaNote">Beta preview: SEQ authority-level records are being reviewed region by region. Some suburbs still use sample placeholders while coverage is built.</p></header>
    <section className="searchPanel card">
      <h2>Search suburb or postcode</h2>
      <input placeholder="Try South Brisbane or 4101" value={query} onChange={(e) => setQuery(e.target.value)} />
      {matchRows.length > 0 ? <div className="chips">{matchRows.slice(0, 10).map((s) => <button key={s.id} onClick={() => setSelectedSuburbId(s.id)}>{s.suburb} ({s.postcode})</button>)}</div> : <div className="searchNoResults"><p><strong>We don’t have that suburb in the beta dataset yet.</strong></p><p>Want us to add this suburb next? Request it below.</p><p>Currently selected report — not a match for your search.</p><div className="chips">{suggestedTestSuburbs.map((n) => { const s = suburbs.find((x) => x.suburb === n); return s ? <button key={s.id} onClick={() => setSelectedSuburbId(s.id)}>{s.suburb}</button> : null; })}</div></div>}
    </section>

    <section className="card snapshot"><h2>{suburb.suburb}, {suburb.state} {suburb.postcode}</h2>
      <div className="badges"><span className="badge trust">Source: {authority.name}</span><span className="badge trust">Zone: {supplyZone.displayName}</span>{hasReviewed ? <><span className="badge trust">Reviewed source-backed data</span><span className="badge trust">Coverage: {coverage?.displayRegionName} authority-level</span><span className="badge">Confidence: medium</span><span className="badge warn">Not individual tap testing</span></> : <><span className="badge warn">Sample / placeholder data only</span><span className="badge warn">No suburb-specific source-backed data is currently displayed</span><span className="badge warn">Beta coverage is being built</span></>}</div>
      {beingReviewed ? <p><strong>{coverage?.displayRegionName}</strong> source data is being reviewed and is not displayed yet.</p> : null}
      {hasReviewed ? <><details className="sourceDetails"><summary><strong>Source details</strong></summary><ul><li><strong>Source owner:</strong> Seqwater</li><li><strong>Source report:</strong> Seqwater {coverage?.displayRegionName} Monthly Water Quality Report — March 2026</li><li><strong>Report month:</strong> March 2026</li><li><strong>Source type:</strong> downloadable_pdf</li><li><strong>Coverage level:</strong> {coverage?.displayRegionName} authority-level</li><li><strong>Review status:</strong> reviewed</li><li><strong>Reviewer initials:</strong> JG</li><li><strong>Review date:</strong> 2026-05-09</li><li><strong>Source file path:</strong> data/source-files/seqwater/Seqwater Water Quality Report - {coverage?.displayRegionName} - 2026-03.pdf</li></ul><p><em>Authority-level monthly water quality data. Not a test from your individual household tap.</em></p></details><ul>{reviewedRecords.map((r) => <li key={r.record_id}><strong>{r.parameter_name}:</strong> min {r.min_value}, avg {r.average_value}, max {r.max_value} {r.unit}</li>)}</ul></> : <ul>{report.parameters.map((p) => <li key={p.key}><strong>{p.displayName}:</strong> {p.placeholderValue} {p.unit} <em>(sample/placeholder)</em></li>)}</ul>}

      <section className="sharePanel"><h3>Share this report</h3><div className="chips"><button onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy report link</button><button onClick={copySummary}>Copy plain-text summary</button><button onClick={() => window.print()}>Print report</button></div></section>
    </section>

    <section className="card"><h3>Request this suburb</h3><p>Want your area added next?</p><form onSubmit={(e) => { e.preventDefault(); alert('Thanks — suburb request capture is coming soon. For now, you can contact Jila Water for Brisbane/SEQ help.'); }}><input placeholder="Suburb" defaultValue={query || suburb.suburb} /><input placeholder="Postcode (optional)" /><input type="email" placeholder="Email" required /><select defaultValue="Taste"><option>Taste</option><option>Smell</option><option>Chlorine</option><option>Hardness/scale</option><option>PFAS</option><option>Fluoride</option><option>Skin/hair</option><option>Appliances</option><option>Other</option></select><button type="submit">Request this suburb</button></form><p><a href="mailto:admin@jilawater.com.au?subject=Whats%20In%20My%20Tap%20Water%20suburb%20request">Email fallback</a></p></section>

    <section className="card ctaCard"><h3>Jila Water for Brisbane/SEQ households</h3><p>Jila Water offers free home water assessments across Brisbane and SEQ.</p><a className="cta" href="https://jilawater.com.au/free-home-water-assessment/?utm_source=whats_in_my_tap_water&utm_medium=referral&utm_campaign=suburb_water_report&utm_content=seq_cta" target="_blank" rel="noreferrer">Book a Free Jila Water Assessment</a></section>
    <section className="card"><h3>Current beta coverage</h3><p>Coverage is expanding region by region. Reviewed source-backed records are shown only after manual QA against official source files. Where reviewed records are not available, the beta may show sample placeholders or ask you to request your suburb.</p><ul><li>Reviewed source-backed authority-level data currently available: Brisbane, selected suburbs; Moreton, selected suburbs.</li><li>Being reviewed: Gold Coast, Logan, Redland, Scenic Rim, Somerset.</li><li>Sample placeholders: some suburbs are included only to test UX while source-backed coverage is built.</li></ul></section>
    <footer className="card footer"><p className="footerWarning"><strong>Warning:</strong> This beta may show reviewed authority-level data for selected SEQ suburbs and sample placeholders elsewhere. Not live utility data or individual household tap testing.</p></footer>
  </main>;
};
