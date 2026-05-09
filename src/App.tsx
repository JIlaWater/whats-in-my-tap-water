import { FormEvent, useEffect, useMemo, useState } from 'react';
import { seqSearchIndex } from './data/seqSearchIndex';
import { profileBySlug } from './data/waterProfiles';
import { lookup } from './search';

const cta = 'https://jilawater.com.au/free-home-water-assessment/?utm_source=whatsinmytapwater&utm_medium=lookup_tool&utm_campaign=seq_tap_water_lookup&utm_content=result_cta';

export function App() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(false);
  useEffect(() => {
    const suburb = new URLSearchParams(window.location.search).get('suburb');
    if (suburb) { setQuery(suburb); setSubmitted(suburb); }
  }, []);
  const match = useMemo(() => lookup(submitted), [submitted]);
  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) return [];
    return seqSearchIndex
      .filter((entry) => entry.suburb.toLowerCase().includes(normalized) || entry.postcode.includes(normalized))
      .slice(0, 8);
  }, [query]);
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSubmitted(query); };

  const renderSingle = (entry: (typeof seqSearchIndex)[number]) => {
    const p = profileBySlug[entry.matchedProfileSlug] ?? profileBySlug['seq-fallback-regional'];
    const shareUrl = `${window.location.origin}${window.location.pathname}?suburb=${encodeURIComponent(entry.suburb)}`;
    const summary = `I checked what may be affecting tap water in ${entry.suburb}. Here’s the local snapshot.`;
    return <section className='card'>
      <p className='label'>{entry.profileType === 'suburb_specific' ? 'Detailed suburb snapshot' : 'Regional guidance snapshot'}</p>
      <h2>{entry.suburb} Tap Water Snapshot</h2>
      <p>{entry.profileType === 'suburb_specific' ? 'This snapshot is based on suburb-specific guidance and regional supply context.' : `Regional guidance based on ${entry.regionGroup} / SEQ supply context.`}</p>
      {entry.profileType !== 'suburb_specific' && <p className='muted'>We haven’t created a suburb-specific source page for {entry.suburb} yet, so this report uses the most relevant regional guidance profile. Property-level testing is recommended for certainty.</p>}
      <p><strong>Confidence:</strong> {p.confidenceLabel} • <strong>Coverage:</strong> {p.coverageLabel} • <strong>Freshness:</strong> {p.freshnessLabel}</p>
      <h3>Likely water-quality themes</h3><ul>{p.commonConcerns.map((x) => <li key={x}>{x}</li>)}</ul>
      <h3>What homeowners commonly notice</h3><ul>{p.likelyNoticeableIssues.map((x) => <li key={x}>{x}</li>)}</ul>
      <h3>What this does and does not mean</h3><ul><li>This is guidance, not a lab result.</li><li>Your property’s plumbing, pipe age, fixtures and storage conditions can affect final tap water.</li><li>Testing is recommended for certainty.</li></ul>
      <h3>Practical next steps</h3><ul>{p.recommendedTesting.map((x) => <li key={x}>{x}</li>)}</ul>
      <div className='share'><strong>Share</strong><div className='row'><button onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy result link</button><button onClick={() => navigator.clipboard.writeText(summary)}>Copy summary</button><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}>Facebook</a><a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(summary)}&url=${encodeURIComponent(shareUrl)}`}>X/Twitter</a><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}>LinkedIn</a><a href={`mailto:?subject=${encodeURIComponent(entry.suburb + ' Tap Water Snapshot')}&body=${encodeURIComponent(summary + ' ' + shareUrl)}`}>Email</a></div></div>
      <div className='cta'><h3>Want to know what’s really coming through your taps?</h3><p>Jila Water can test your home’s water and recommend the right whole home filtration setup for your property.</p><a href={cta}>Book My Free Home Water Assessment</a></div>
      <details><summary>Source notes</summary><ul>{p.sourceNotes.map((s) => <li key={s}>{s}</li>)}</ul></details>
    </section>;
  };

  return <main className='wrap'><h1>What’s In My Tap Water?</h1><p>Enter your suburb or postcode to get a local tap water snapshot based on regional water-supply context, public guidance and practical household filtration advice.</p>
    <form onSubmit={onSubmit}>
      <div className='searchBox'>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSuggestionsOpen(true); }}
          onFocus={() => setSuggestionsOpen(true)}
          onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 120)}
          placeholder='Try Morningside, 4170, Robina, Ipswich, Caloundra…'
          aria-label='Search by suburb or postcode'
        />
        {isSuggestionsOpen && suggestions.length > 0 && <ul className='suggestions' role='listbox' aria-label='Search suggestions'>
          {suggestions.map((item) => <li key={`${item.suburb}-${item.postcode}`}><button type='button' onClick={() => { setQuery(item.suburb); setSubmitted(item.suburb); setSuggestionsOpen(false); }}>{item.suburb} ({item.postcode})</button></li>)}
        </ul>}
      </div>
      <button>Check My Tap Water</button><a href='https://jilawater.com.au/free-home-water-assessment/'>Book a Free Home Water Assessment</a>
    </form>
    <p className='muted'>Built for South East Queensland households. Regional guidance only. Property-level testing recommended for certainty.</p>
    {match.type === 'single' && renderSingle(match.entry)}
    {match.type === 'postcode_multiple' && <section className='card'><h2>Postcode {match.postcode} covers multiple nearby suburbs. Choose one below.</h2><div className='row'>{match.entries.map((e) => <button key={e.suburb} onClick={() => { setQuery(e.suburb); setSubmitted(e.suburb); }}>{e.suburb}</button>)}</div></section>}
    {match.type === 'unknown' && <section className='card'><h2>We don’t have a SEQ water snapshot for that location yet.</h2><p>This tool currently focuses on South East Queensland, from the Sunshine Coast and Noosa through Brisbane, Ipswich, Logan, the Gold Coast, Lockyer Valley and Toowoomba.</p><p>Try searching a suburb like Morningside, Robina, Ipswich, Caloundra or Toowoomba.</p>{match.suggestions.length > 0 && <p>Did you mean one of these? {match.suggestions.map((s) => s.suburb).join(', ')}</p>}<a href='https://jilawater.com.au/free-home-water-assessment/'>Book a Free Water Assessment</a></section>}
  </main>;
}
