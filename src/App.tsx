import { FormEvent, useMemo, useState } from 'react';
import { locationProfiles, reviewedChips } from './seedData';
import { buildSeoMeta } from './seo';
import type { LocationProfile } from './dataModels';

const normalize = (v: string) => v.trim().toLowerCase();

const findLocation = (query: string): { profile?: LocationProfile; suggestions: string[] } => {
  const q = normalize(query);
  if (!q) return { suggestions: [] };
  const exact = locationProfiles.find((p) => p.postcode === q || normalize(p.suburb) === q || p.aliases.some((a) => normalize(a) === q));
  if (exact) return { profile: exact, suggestions: [] };
  const partial = locationProfiles.filter((p) => normalize(p.suburb).includes(q) || p.aliases.some((a) => normalize(a).includes(q)));
  if (partial.length === 1) return { profile: partial[0], suggestions: [] };
  return { suggestions: partial.slice(0, 3).map((p) => `${p.suburb} ${p.postcode}`) };
};

export function App() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const { profile, suggestions } = useMemo(() => findLocation(submitted), [submitted]);
  const seo = buildSeoMeta(profile ? `${profile.suburb} ${profile.postcode}` : 'Australia', profile?.confidence ?? 'Unknown', Boolean(profile?.seoIndexable));
  document.title = seo.title;

  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSubmitted(query); };
  const social = profile ? `I checked the tap-water snapshot for ${profile.suburb}. It shows source-backed context for taste, odour, scale comfort and what to test at your own tap. Worth checking your suburb.` : '';

  return <main className='layout'>
    <section className='betaBanner'>Built from public authority data, official guidance and source-backed regional records. General guidance only — not a household lab test.</section>
    <section className='card hero'>
      <h1>What’s Really In Your Tap Water?</h1>
      <p className='subheading'>Enter your suburb or postcode to see your local water authority, likely source, taste and scale watchlist, treatment context and what to test at your own tap.</p>
      <form className='searchForm' onSubmit={onSubmit}><div className='searchRow'><input placeholder='Enter suburb or postcode' value={query} onChange={(e) => setQuery(e.target.value)} /><button className='primaryButton'>Check My Tap Water</button></div></form>
      <div className='chips'>{reviewedChips.map((c) => <button key={c} type='button' onClick={() => { setQuery(c); setSubmitted(c); }}>{c}</button>)}</div>
    </section>

    {profile ? <section className='card'>
      <h2>{profile.suburb}, {profile.state} {profile.postcode}</h2>
      <div className='badges'><span className='badge trust'>Confidence: {profile.confidence}</span><span className='badge'>Coverage: {profile.coverageLevel}</span><span className='badge'>Freshness: {profile.freshness}</span><span className='badge'>Status: {profile.reviewStatus}</span></div>
      <p><strong>Likely provider:</strong> {profile.providerName} ({profile.waterAuthority})</p>
      <p><strong>Water source context:</strong> {profile.waterSourceContext}</p>
      <p><strong>Treatment context:</strong> {profile.treatmentContext}</p>
      <h3>Household comfort watchlist</h3><ul>{profile.householdComfortWatchlist.map((i) => <li key={i}>{i}</li>)}</ul>
      <h3>What to test at home</h3><ul>{profile.whatToTestAtHome.map((i) => <li key={i}>{i}</li>)}</ul>
      <h3>Filter pathway suggestions</h3><ul>{profile.recommendedFiltrationPathways.map((i) => <li key={i}>{i}</li>)}</ul>
      <p className='muted'>Suggested filtration pathways are general and should be confirmed by testing your property’s actual water.</p>
      <h3>Sources</h3><ul>{profile.sources.map((s) => <li key={s.title}>{s.humanLabel}: {s.title} • {s.publisher} • {s.publicationDate ?? 'Date under review'} • {s.coverageLevel} • {s.confidence}</li>)}</ul>
      <h3>Share this report</h3><div className='chips'><button type='button' onClick={() => navigator.clipboard.writeText(`${profile.suburb} tap-water snapshot: ${profile.waterSourceContext}`)}>Copy report summary</button><button type='button' onClick={() => navigator.clipboard.writeText(social)}>Copy social post</button><button type='button' onClick={() => window.print()}>Print/save report</button></div>
      <p><strong>Cite this report:</strong> What’s In My Tap Water? suburb report for {profile.suburb}. Built from public authority data, official guidance and source-backed regional records. General guidance only; property-level testing recommended.</p>
    </section> : submitted ? <section className='card'><h2>No exact suburb match yet</h2><p>We could not match “{submitted}”. We never show unrelated suburb reports. Try a reviewed area or request review.</p>{suggestions.length > 0 && <p>Suggestions: {suggestions.join(', ')}</p>}</section> : null}

    <section className='card'><h3>How your area compares</h3><div className='coverageGrid'>{locationProfiles.slice(0, 6).map((p) => <div key={p.id}><h4>{p.suburb}</h4><p>Taste/Odour: {p.tasteOdourCategory}</p><p>Scale comfort: {p.scaleRiskCategory}</p><p>Source confidence: {p.confidence}</p><p>Review status: {p.reviewStatus}</p></div>)}</div></section>
    <section className='card ctaCard'><h3>Want certainty at your own tap?</h3><p>For Brisbane and SE QLD households, Jila Water can test your actual home tap water and recommend the right whole-home filtration option based on your property, plumbing and concerns.</p><a className='cta' href={'https://jilawater.com.au/free-home-water-assessment/'} target='_blank' rel='noreferrer'>Book a Free Home Water Assessment</a></section>
  </main>;
}
