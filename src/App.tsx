declare global { interface Window { __JILA_ASSESSMENT_URL__?: string } }
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { regions, reportProfiles, sources, suburbs } from './seedData';
import { buildSeoMeta } from './seo';

const normalise = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');

const levenshtein = (a: string, b: string) => {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
};

export const App = () => {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const submittedNormal = normalise(submittedQuery);

  const knownByAlias = useMemo(() => {
    const map = new Map<string, string>();
    suburbs.forEach((suburb) => {
      map.set(normalise(suburb.suburb), suburb.id);
      map.set(suburb.postcode, suburb.id);
    });
    map.set('nundah', 'west-end-4101');
    return map;
  }, []);

  const selectedSuburb = selectedId ? suburbs.find((s) => s.id === selectedId) ?? null : null;
  const directMatchId = knownByAlias.get(submittedNormal) ?? null;
  const resolvedSuburb = selectedSuburb ?? (directMatchId ? suburbs.find((s) => s.id === directMatchId) ?? null : null);

  const suggestion = useMemo(() => {
    if (!submittedNormal || directMatchId) return null;
    const byDistance = suburbs
      .map((s) => ({ suburb: s, dist: levenshtein(submittedNormal, normalise(s.suburb)) }))
      .sort((a, b) => a.dist - b.dist)[0];
    if (!byDistance || byDistance.dist > 2) return null;
    return byDistance.suburb;
  }, [directMatchId, submittedNormal]);

  const region = resolvedSuburb ? regions.find((r) => r.slug === resolvedSuburb.regionSlug) ?? regions.find((r) => r.slug === 'unknown')! : null;
  const profile = region ? reportProfiles.find((p) => p.regionSlug === region.slug) ?? reportProfiles.find((p) => p.regionSlug === 'unknown')! : null;
  const sourceRows = profile ? sources.filter((s) => profile.sourceIds.includes(s.id)) : [];
  const isReviewed = Boolean(profile && profile.confidence !== 'Unknown' && profile.coverage !== 'Unknown' && resolvedSuburb);
  const isKnownButPending = Boolean(resolvedSuburb && !isReviewed);
  const isUnknownSearch = Boolean(submittedNormal && !resolvedSuburb);

  const hasEnoughSourceMetadata = sourceRows.length > 0 && sourceRows.every((s) => s.sourceUrl && s.sourceType && s.publicationDate && s.coverageLevel && s.confidence && s.freshnessLabel);

  const seoLocation = resolvedSuburb ? `${resolvedSuburb.suburb} ${resolvedSuburb.postcode}` : submittedQuery || 'Search';
  const seo = buildSeoMeta(seoLocation, profile?.confidence ?? 'Unknown', Boolean(isReviewed));

  useEffect(() => {
    document.title = seo.title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
    meta.setAttribute('content', seo.description);

    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.setAttribute('name', 'robots'); document.head.appendChild(robots); }
    robots.setAttribute('content', isReviewed ? 'index,follow' : 'noindex,follow');
  }, [isReviewed, seo]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(query);
    setSelectedId(null);
  };

  return <main className='layout'>
    <section className='betaBanner'>Beta data notice: reviewed SE QLD authority-level data is available for selected areas. Other suburbs may still show review-pending states while coverage is being built.</section>

    <section className='card hero'>
      <h1>Find trusted, source-backed tap-water guidance for your suburb.</h1>
      <p className='subheading'>Clear public-interest reporting for Brisbane and South East Queensland, written in plain English and updated as new official sources are reviewed.</p>

      <form className='searchForm' onSubmit={onSearch}>
        <label htmlFor='suburb-search'>Search suburb or postcode</label>
        <div className='searchRow'>
          <input id='suburb-search' aria-label='Suburb or postcode search' placeholder='Enter suburb or postcode' value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className='primaryButton' type='submit'>Search</button>
        </div>
      </form>

      <p className='chipLabel'>Try a reviewed area</p>
      <div className='chips'>{suburbs.filter((s) => s.regionSlug !== 'unknown').slice(0, 6).map((s) => <button key={s.id} type='button' onClick={() => { setQuery(`${s.suburb} ${s.postcode}`); setSubmittedQuery(`${s.suburb}`); setSelectedId(s.id); }}>{s.suburb} ({s.postcode})</button>)}</div>

      {!submittedNormal && <p className='muted'>Enter a suburb or postcode to view available reviewed coverage. We only show data that has source details and review metadata.</p>}
      {suggestion && <p className='notice'>Did you mean <button type='button' className='textButton' onClick={() => { setQuery(suggestion.suburb); setSubmittedQuery(suggestion.suburb); }}>{suggestion.suburb}</button>?</p>}
    </section>

    {isReviewed && resolvedSuburb && region && profile && <section className='card snapshot'>
      <p className='kicker'>Reviewed suburb report</p>
      <h2>{resolvedSuburb.suburb}, QLD {resolvedSuburb.postcode}</h2>
      <div className='badges'>
        <span className='badge trust'>Confidence: {profile.confidence}</span>
        <span className='badge'>Coverage: {profile.coverage}</span>
        <span className='badge'>Freshness: {profile.freshness}</span>
      </div>
      <p><strong>Source-backed status:</strong> {hasEnoughSourceMetadata ? 'Available with authority-level references' : 'Review pending for full source metadata'}</p>
      <h3>What we know</h3>
      <p>{profile.summary}</p>
      <ul>{profile.likelySymptoms.map((s) => <li key={s}>{s}</li>)}</ul>
      <h3>What we’re still reviewing</h3>
      <ul>
        <li>Verified suburb-level public data is not available yet.</li>
        <li>Regional source currently under review.</li>
        <li>Household testing required for property-specific result.</li>
      </ul>
      <h3>Source summary</h3>
      <ul>{sourceRows.map((s) => <li key={s.id}>{s.sourceName} • {s.sourceType} • Published {s.publicationDate} • Coverage {s.coverageLevel} • Confidence {s.confidence} • Freshness {s.freshnessLabel}</li>)}</ul>
      <p className='footerWarning'>This report uses public authority-level information where available. It is general guidance only and is not a replacement for property-specific tap-water testing.</p>
    </section>}

    {isKnownButPending && resolvedSuburb && <section className='card'>
      <h2>Looks like we haven’t reviewed this suburb yet.</h2>
      <p>We’re adding source-backed suburb and regional reports in stages. You can request this suburb and we’ll prioritise it for review.</p>
      <p><strong>Requested suburb:</strong> {resolvedSuburb.suburb}, QLD {resolvedSuburb.postcode}</p>
      <p>Not enough verified suburb-level public data yet.</p>
    </section>}

    {isUnknownSearch && <section className='card'>
      <h2>Looks like we haven’t reviewed this suburb yet.</h2>
      <p>We’re adding source-backed suburb and regional reports in stages. You can request this suburb and we’ll prioritise it for review.</p>
      <p>Source-backed value not yet available.</p>
    </section>}

    {(isKnownButPending || isUnknownSearch) && <section className='card'>
      <h3>Request this suburb for review</h3>
      <form className='requestForm'>
        <label>Suburb<input defaultValue={submittedQuery} /></label>
        <label>Postcode (optional)<input /></label>
        <label>Email for updates (optional)<input type='email' placeholder='you@example.com' /></label>
        <label>What matters most to your household?<textarea rows={3} placeholder='Taste, odour, scale, dry skin, appliance protection, or other concerns.' /></label>
        <button className='primaryButton' type='button'>Submit suburb request</button>
      </form>
      <p className='muted'>We only use this information to prioritise public data review coverage.</p>
    </section>}

    <section className='card ctaCard'>
      <h3>Need property-specific certainty?</h3>
      <p>For Brisbane and SE QLD households, Jila Water can test your home’s actual tap water and recommend the right whole-home filtration option.</p>
      <a className='cta' href={window.__JILA_ASSESSMENT_URL__ ?? 'https://jilawater.com.au/free-home-water-assessment/'} target='_blank' rel='noreferrer'>Book a Free Home Water Assessment</a>
    </section>

    <section className='card'>
      <h3>Current beta coverage</h3>
      <div className='coverageGrid'>
        <div><h4>Reviewed regions</h4><ul>{regions.filter((r) => r.slug !== 'unknown').map((r) => <li key={r.slug}>{r.name}</li>)}</ul></div>
        <div><h4>Coming soon</h4><ul>{regions.filter((r) => r.slug === 'unknown').map((r) => <li key={r.slug}>Additional SE QLD suburbs and regional profiles being reviewed</li>)}</ul></div>
      </div>
    </section>
  </main>;
};

export default App;
