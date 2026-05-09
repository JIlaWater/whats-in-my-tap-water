declare global { interface Window { __JILA_ASSESSMENT_URL__?: string } }
import { useEffect, useMemo, useState } from 'react';
import { captureAttribution } from './attribution';
import { buildLeadPayload } from './lead';
import { regions, reportProfiles, sources, suburbs } from './seedData';
import { buildSeoMeta } from './seo';

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(suburbs[0].id);
  const [attribution, setAttribution] = useState({});

  useEffect(() => setAttribution(captureAttribution()), []);

  const cleanQuery = query.trim();
  const normalQuery = cleanQuery.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const matches = useMemo(() => {
    if (!normalQuery) return suburbs;
    return suburbs.filter((s) => s.suburb.toLowerCase().includes(normalQuery) || s.postcode === normalQuery);
  }, [normalQuery]);

  const isLikelyNonQldPostcode = /^\d{4}$/.test(cleanQuery) && !suburbs.some((s) => s.postcode === cleanQuery);
  const suburb = suburbs.find((s) => s.id === selectedId) ?? suburbs[0];
  const region = regions.find((r) => r.slug === suburb.regionSlug) ?? regions.find((r) => r.slug === 'unknown')!;
  const profile = reportProfiles.find((p) => p.regionSlug === region.slug) ?? reportProfiles.find((p) => p.regionSlug === 'unknown')!;
  const sourceRows = sources.filter((s) => profile.sourceIds.includes(s.id));
  const hasSubstantialContent = profile.confidence === 'High' || profile.confidence === 'Medium';
  const seo = buildSeoMeta(`${suburb.suburb} ${suburb.postcode}`, profile.confidence, hasSubstantialContent);

  useEffect(() => {
    document.title = seo.title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
    meta.setAttribute('content', seo.description);
  }, [seo]);

  return <main className='layout'>
    <section className='card'>
      <h1>What’s In My Tap Water?</h1>
      <p>Public mains water is generally treated to Australian drinking water standards, but many households still want clearer practical information.</p>
      <input aria-label='Suburb or postcode search' placeholder='Enter suburb or postcode' value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className='chips'>{matches.slice(0, 8).map((s) => <button key={s.id} onClick={() => setSelectedId(s.id)}>{s.suburb} ({s.postcode})</button>)}</div>
      {cleanQuery.length === 0 && <p>Tip: try South Brisbane, West End, 4101, or Caboolture.</p>}
      {matches.length === 0 && <p><strong>We don’t have enough official data yet for that search.</strong> Public source data is not specific enough to give a verified suburb-level number here yet.</p>}
      {isLikelyNonQldPostcode && <p>This looks like a non-QLD or currently unsupported postcode in this MVP. We can still show general guidance while coverage expands.</p>}
      {matches.length > 1 && <p>Multiple matches found. Please select your suburb above for the closest report context.</p>}
    </section>

    <section className='card'>
      <h2>{suburb.suburb} {suburb.postcode}</h2>
      <p><strong>Confidence:</strong> {profile.confidence} | <strong>Coverage:</strong> {profile.coverage} | <strong>Freshness:</strong> {profile.freshness}</p>
      <p><strong>Last checked date:</strong> {profile.lastCheckedDate}</p>
      <p>{profile.summary}</p>
      <h3>Likely household symptoms</h3><ul>{profile.likelySymptoms.map((s) => <li key={s}>{s}</li>)}</ul>
      <h3>Practical next steps</h3><ul>{profile.recommendation.nextSteps.map((s) => <li key={s}>{s}</li>)}</ul>
      <p><em>{region.disclaimer}</em></p>
    </section>

    <section className='card'>
      <h3>Source summary</h3>
      <ul>{sourceRows.map((s) => <li key={s.id}>{s.sourceName} — {s.sourceType} — publication: {s.publicationDate} — last checked: {s.lastCheckedDate} — coverage: {s.coverageLevel} — freshness: {s.freshnessLabel} — confidence: {s.confidence} — {s.sourceUrl}</li>)}</ul>
      <p><strong>Methodology:</strong> {profile.methodology}</p>
      <p><strong>Commercial disclosure:</strong> This public report is provided in partnership with Jila Water for South East Queensland households. It is general information, not a lab test.</p>
      <button onClick={() => navigator.clipboard.writeText(`${suburb.suburb} ${suburb.postcode} | ${seo.canonical}`)}>Copy citation</button>
    </section>

    {region.isSeqld ? <section className='card ctaCard'><a className='cta' href={window.__JILA_ASSESSMENT_URL__ ?? 'https://jilawater.com.au/free-home-water-assessment/'} target='_blank' rel='noreferrer'>Book a Free Home Water Assessment</a></section> : <section className='card'><p>Outside SE QLD? We still provide public-data guidance while local profiles are expanded.</p></section>}

    <section className='card'>
      <h3>Lead payload preview (safe local only)</h3>
      <pre>{JSON.stringify(buildLeadPayload({ first_name: 'Preview', email: 'preview@example.com', main_concern: 'Taste', suburb, region, profile, attribution }), null, 2)}</pre>
      <p>If webhook delivery is added later, configure <code>JILA_ZAPIER_WEBHOOK_URL</code> in the environment and fail gracefully when it is missing.</p>
    </section>
  </main>;
};

export default App;
