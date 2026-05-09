import { FormEvent, useMemo, useState } from 'react';
import { locationProfiles, reviewedChips } from './seedData';
import type { LocationProfile } from './dataModels';
import { searchProfiles } from './search';

const comparison = ['Brisbane CBD', 'South Brisbane', 'West End', 'Caboolture', 'Ipswich', 'Gold Coast', 'Redlands / Bayside', 'Logan', 'Sunshine Coast'];

const Snapshot = ({ profile }: { profile: LocationProfile }) => {
  const citation = `${profile.suburb} snapshot generated from public authority records and official guidance. Last checked ${profile.lastChecked}.`;
  return <section className='card snapshot'>
    <h2>{profile.suburb} Tap Water Snapshot</h2>
    <p className='subheading'>Source-backed regional guidance for {profile.suburb}, QLD {profile.postcode}.</p>
    <div className='scoreGrid'>{[['Provider / authority', `${profile.providerName} • ${profile.waterAuthority}`], ['Coverage level', profile.coverageLevel], ['Confidence', profile.confidence], ['Taste & odour watchlist', profile.tasteOdourCategory], ['Scale comfort watchlist', profile.scaleRiskCategory], ['Property testing recommended', 'Yes']].map(([k, v]) => <article key={k}><p>{k}</p><strong>{v}</strong></article>)}</div>
    <h3>Household Comfort Watchlist</h3><div className='watchGrid'>{profile.householdComfortWatchlist.map((w) => <article key={w.label}><h4>{w.label}</h4><span className='badge'>{w.level}</span><p>{w.note}</p></article>)}</div>
    <h3>What locals may notice</h3><ul>{profile.whatLocalsMayNotice.map((i) => <li key={i}>{i}</li>)}</ul>
    <h3>What to test at home</h3><ul>{profile.whatToTestAtHome.map((i) => <li key={i}>☑ {i}</li>)}</ul>
    <h3>Filter pathway suggestions</h3><div className='watchGrid'>{profile.recommendedFiltrationPathways.map((i) => <article key={i}><p>{i}</p></article>)}</div>
    <p className='muted'>General guidance only. Confirm with property-specific testing before choosing a system.</p>
    <h3>Source cards</h3><div className='watchGrid'>{profile.sources.map((s) => <article key={s.title}><h4>{s.humanLabel}</h4><p>{s.title}</p><p>{s.publisher}</p><p>{s.publicationDate ?? 'Date under review'}</p><p>Coverage: {s.coverageLevel} • Confidence: {s.confidence}</p>{s.url ? <a href={s.url} target='_blank' rel='noreferrer'>View source</a> : <p>Link unavailable</p>}</article>)}</div>
    <h3>Share this report</h3><div className='chips'><button type='button' onClick={() => navigator.clipboard.writeText(profile.shareSummary)}>Copy suburb summary</button><button type='button' onClick={() => navigator.clipboard.writeText(profile.socialPost)}>Copy social post</button><button type='button' onClick={() => window.print()}>Print / save report</button><button type='button' onClick={() => navigator.clipboard.writeText(citation)}>Copy citation</button></div>
  </section>;
};

export function App() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const result = useMemo(() => searchProfiles(submitted), [submitted]);
  const primary = result.profiles[0];

  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSubmitted(query); };

  return <main className='layout'>
    <section className='betaBanner'>Built from public water authority data, official guidance and source-backed regional records. General guidance only — not a household lab test.</section>
    <section className='card hero'><h1>What’s Really In Your Tap Water?</h1><p className='subheading'>Enter your suburb or postcode to see your local water authority, likely source, taste and scale watchlist, treatment context and what to test at your own tap.</p><form className='searchForm' onSubmit={onSubmit}><div className='searchRow'><input placeholder='Enter suburb or postcode' value={query} onChange={(e) => setQuery(e.target.value)} /><button className='primaryButton'>Check My Tap Water</button></div></form><p className='chipLabel'>Reviewed suburbs</p><div className='chips'>{reviewedChips.map((c) => <button key={c} type='button' onClick={() => { setQuery(c); setSubmitted(c); }}>{c}</button>)}</div></section>
    {result.status === 'single' && primary && <Snapshot profile={primary} />}
    {result.status === 'multiple' && <section className='card'><h2>Multiple matches for “{submitted}”</h2><p>Choose your local snapshot:</p><div className='chips'>{result.profiles.map((p) => <button key={p.id} onClick={() => { setQuery(p.suburb); setSubmitted(p.suburb); }}>{p.suburb} {p.postcode}</button>)}</div></section>}
    {result.status === 'unknown' && <section className='card'><h2>We could not verify an exact local match yet</h2><p>We never show an unrelated suburb report. Try a nearby reviewed area or request review for “{submitted}”.</p>{result.suggestions.length > 0 && <p>Did you mean: {result.suggestions.join(', ')}?</p>}<h3>Useful fallback: what to test at home</h3><ul><li>Chlorine/chloramine</li><li>Hardness</li><li>pH and TDS</li><li>Sediment/turbidity</li><li>Taste/odour notes</li><li>Plumbing age and pipe material</li></ul></section>}
    <section className='card'><h3>How your area compares</h3><div className='coverageGrid'>{comparison.map((name) => { const p = locationProfiles.find((x) => x.suburb === name); if (!p) return null; return <article key={p.id}><h4>{p.suburb}</h4><p>Taste/odour: {p.tasteOdourCategory}</p><p>Scale comfort: {p.scaleRiskCategory}</p><p>Source confidence: {p.confidence}</p><p>Review status: {p.reviewStatus}</p></article>; })}</div></section>
    <section className='card ctaCard'><h3>Want certainty at your own tap?</h3><p>For Brisbane and SE QLD households, Jila Water can test your actual home tap water and recommend the right whole-home filtration option based on your property, plumbing and concerns.</p><a className='cta' href='https://jilawater.com.au/free-home-water-assessment/' target='_blank' rel='noreferrer'>Book a Free Home Water Assessment</a></section>
  </main>;
}
