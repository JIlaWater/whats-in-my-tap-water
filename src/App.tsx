import { useEffect, useMemo, useState } from 'react';
import { authorities, reports, suburbMappings, suburbs, supplyZones } from './seedData';

const SAMPLE_LABEL = 'SAMPLE / PLACEHOLDER DATA ONLY';

const slugFor = (suburbId: string) => suburbId;

const getRouteSuburbId = () => {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts[0] === 'report' && parts[1]) return parts[1];
  return null;
};

const isBrisbaneOrSeq = (region: string): boolean => ['brisbane', 'seq'].includes(region.toLowerCase());

export const App = () => {
  const [query, setQuery] = useState('');
  const [routeSuburbId, setRouteSuburbId] = useState<string | null>(() => getRouteSuburbId());

  useEffect(() => {
    const onPop = () => setRouteSuburbId(getRouteSuburbId());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suburbs.slice(0, 8);
    return suburbs
      .filter((s) => s.suburb.toLowerCase().includes(q) || s.postcode.includes(q))
      .slice(0, 10);
  }, [query]);

  const activeSuburbId = routeSuburbId ?? suggestions[0]?.id ?? suburbs[0]?.id;
  const suburb = suburbs.find((s) => s.id === activeSuburbId);
  const mapping = suburbMappings.find((m) => m.suburbId === activeSuburbId);
  const authority = authorities.find((a) => a.id === mapping?.authorityId);
  const supplyZone = supplyZones.find((z) => z.id === mapping?.supplyZoneId);
  const report = reports.find((r) => r.suburbId === activeSuburbId);

  const nearbySuburbs = useMemo(() => {
    if (!suburb) return [];
    return suburbs.filter((s) => s.id !== suburb.id && (s.postcode === suburb.postcode || s.lga === suburb.lga)).slice(0, 5);
  }, [suburb]);

  const reportUrl = suburb ? `${window.location.origin}/report/${slugFor(suburb.id)}` : window.location.href;

  useEffect(() => {
    if (!suburb) return;
    document.title = `${suburb.suburb} Tap Water Report (${SAMPLE_LABEL}) | WhatsInMyTapWater.com`;

    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property='${name}']` : `meta[name='${name}']`;
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        if (property) tag.setAttribute('property', name);
        else tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    setMeta('description', `${suburb.suburb} ${suburb.postcode} tap water report with sample placeholder values, freshness and confidence badges.`);
    setMeta('og:title', `${suburb.suburb} Tap Water Snapshot (${SAMPLE_LABEL})`, true);
    setMeta('og:description', `Shareable suburb report for ${suburb.suburb}. All values are currently sample placeholder data only.`, true);
    setMeta('og:url', reportUrl, true);

    const jsonLd = {
      webPage: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${suburb.suburb} Tap Water Report (${SAMPLE_LABEL})`,
        url: reportUrl,
        description: `Placeholder suburb water report for ${suburb.suburb} ${suburb.postcode}.`,
      },
      breadcrumbList: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
          { '@type': 'ListItem', position: 2, name: 'Suburb Reports', item: `${window.location.origin}/report` },
          { '@type': 'ListItem', position: 3, name: `${suburb.suburb} ${suburb.postcode}`, item: reportUrl },
        ],
      },
      faqPage: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Is this live tap water data?', acceptedAnswer: { '@type': 'Answer', text: 'No. This page contains sample placeholder data only.' } },
          { '@type': 'Question', name: 'How often will sources refresh?', acceptedAnswer: { '@type': 'Answer', text: 'Current placeholder cadence is shown in the source freshness badge.' } },
        ],
      },
    };

    let script = document.getElementById('suburb-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'suburb-jsonld';
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }, [suburb, reportUrl]);

  const openReport = (suburbId: string) => {
    window.history.pushState({}, '', `/report/${slugFor(suburbId)}`);
    setRouteSuburbId(suburbId);
  };

  const copyLink = async () => navigator.clipboard.writeText(reportUrl);
  const copyTextSummary = async () => {
    if (!suburb || !report || !authority) return;
    const text = `${SAMPLE_LABEL}\n${suburb.suburb} ${suburb.postcode}\nAuthority: ${authority.name}\nConfidence: ${report.confidence.level} (${report.confidence.scoreOutOf100}/100)\nFreshness: ${report.sourceFreshness.sourceName} fetched ${report.sourceFreshness.fetchedAt}\n${report.parameters.map((p) => `${p.displayName}: ${p.placeholderValue} ${p.unit} [sample]`).join('\n')}\nNo health guidance provided.`;
    await navigator.clipboard.writeText(text);
  };

  if (!suburb || !mapping || !authority || !supplyZone || !report) {
    return <main className="layout">Unable to load sample report data.</main>;
  }

  return (
    <main className="layout">
      <header className="top">
        <h1>Suburb Tap Water Report</h1>
        <p className="banner"><strong>{SAMPLE_LABEL}</strong> — no live water readings or health guidance.</p>
      </header>

      <section className="searchPanel">
        <h2>Search suburb or postcode</h2>
        <input placeholder="Try South Brisbane or 4101" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="chips">{suggestions.map((s) => <button key={s.id} onClick={() => openReport(s.id)}>{s.suburb} ({s.postcode})</button>)}</div>
      </section>

      <section className="card snapshot" aria-label="Tap Water Snapshot">
        <p className="kicker">Tap Water Snapshot</p>
        <h2>{suburb.suburb}, {suburb.state} {suburb.postcode}</h2>
        <div className="badges">
          <span className="badge">Confidence: {report.confidence.level} ({report.confidence.scoreOutOf100}/100)</span>
          <span className="badge">Freshness: {report.sourceFreshness.staleness}</span>
          <span className="badge warn">{SAMPLE_LABEL}</span>
        </div>
        <ul>{report.parameters.map((param) => <li key={param.key}><strong>{param.displayName}:</strong> {param.placeholderValue} {param.unit} <em>(sample)</em></li>)}</ul>
      </section>

      <section className="actions card">
        <button onClick={copyLink}>Copy report link</button>
        <button onClick={() => window.print()}>Print report</button>
        <button disabled>Download report (coming soon)</button>
        <button disabled>Share to Facebook (placeholder)</button>
        <button disabled>Share to Reddit (placeholder)</button>
        <button disabled>Share to WhatsApp (placeholder)</button>
        <button onClick={copyTextSummary}>Copy plain-text summary</button>
      </section>

      <section className="card">
        <h3>Report details</h3>
        <p><strong>Water authority:</strong> {authority.name} ({authority.serviceArea})</p>
        <p><strong>Supply zone:</strong> {supplyZone.displayName} ({supplyZone.code})</p>
        <p><strong>Source freshness:</strong> {report.sourceFreshness.sourceName} · fetched {report.sourceFreshness.fetchedAt} · expected refresh {report.sourceFreshness.expectedRefreshDays} days</p>
        <p><strong>Confidence reason:</strong> {report.confidence.reason}</p>
      </section>

      <section className="card">
        <h3>Compare with another suburb</h3>
        <div className="chips">{suburbs.filter((s) => s.id !== suburb.id).slice(0, 6).map((s) => <button key={s.id} onClick={() => openReport(s.id)}>{s.suburb}</button>)}</div>
      </section>

      <section className="card">
        <h3>Nearby suburbs (sample links)</h3>
        <div className="chips">{nearbySuburbs.length ? nearbySuburbs.map((s) => <button key={s.id} onClick={() => openReport(s.id)}>{s.suburb} ({s.postcode})</button>) : <p className="muted">No nearby sample suburbs available.</p>}</div>
      </section>

      {isBrisbaneOrSeq(suburb.region) ? (
        <section className="card ctaCard">
          <h3>Jila Water for Brisbane/SEQ households</h3>
          <p>Explore Jila Water for Brisbane and South East Queensland locations.</p>
          <a className="cta" href="https://jilawater.com.au/free-home-water-assessment/?utm_source=whats_in_my_tap_water&utm_medium=referral&utm_campaign=suburb_water_report&utm_content=seq_cta" target="_blank" rel="noreferrer">Book a Free Jila Water Assessment</a>
        </section>
      ) : (
        <section className="card ctaCard neutral">
          <h3>Outside Jila service area</h3>
          <p>This suburb is currently outside the Brisbane/SEQ service CTA. Check local providers and council resources.</p>
        </section>
      )}

      <section className="card faq">
        <h3>Suburb report FAQ</h3>
        <h4>Is this live tap water data?</h4>
        <p>No. Every value on this page is clearly marked as sample/placeholder data.</p>
        <h4>Can I use this for health decisions?</h4>
        <p>No. This page does not provide health guidance or medical recommendations.</p>
        <h4>Why share this report?</h4>
        <p>It helps neighbors discuss local water transparency while the live data integrations are being built.</p>
      </section>
    </main>
  );
};
