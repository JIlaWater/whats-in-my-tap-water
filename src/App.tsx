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

  const openReport = (suburbId: string) => {
    window.history.pushState({}, '', `/report/${slugFor(suburbId)}`);
    setRouteSuburbId(suburbId);
  };

  if (!suburb || !mapping || !authority || !supplyZone || !report) {
    return <main className="layout">Unable to load sample report data.</main>;
  }

  return (
    <main className="layout">
      <h1>WhatsInMyTapWater.com — Data Architecture MVP</h1>
      <p className="banner">
        <strong>{SAMPLE_LABEL}.</strong> Structured for future Australia Post / ABS / Seqwater / Urban Utilities / Sydney Water / Melbourne Water ingestion.
      </p>

      <section className="searchPanel">
        <h2>Search suburb or postcode</h2>
        <input
          placeholder="Try South Brisbane or 4101"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="chips">
          {suggestions.map((s) => (
            <button key={s.id} onClick={() => openReport(s.id)}>
              {s.suburb} ({s.postcode})
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>
          Dynamic Suburb Report Route: <code>/report/{slugFor(suburb.id)}</code>
        </h2>
        <p>
          <strong>Suburb:</strong> {suburb.suburb}, {suburb.state} {suburb.postcode}
        </p>
        <p>
          <strong>LGA / Region:</strong> {suburb.lga} / {suburb.region}
        </p>
        <p>
          <strong>Water Authority Mapping:</strong> {authority.name} ({authority.serviceArea})
        </p>
        <p>
          <strong>Supply Zone Mapping:</strong> {supplyZone.displayName} ({supplyZone.code})
        </p>
        <p>
          <strong>Data Confidence:</strong> {report.confidence.level} ({report.confidence.scoreOutOf100}/100) — {report.confidence.reason}
        </p>
        <p>
          <strong>Source Freshness:</strong> {report.sourceFreshness.sourceName} | fetched {report.sourceFreshness.fetchedAt} | refresh every {report.sourceFreshness.expectedRefreshDays} days
        </p>
        <h3>Water Parameters ({SAMPLE_LABEL})</h3>
        <ul>
          {report.parameters.map((param) => (
            <li key={param.key}>
              {param.displayName}: {param.placeholderValue} {param.unit} — {param.methodNote}
            </li>
          ))}
        </ul>
        <p className="note">{report.notes.join(' ')}</p>
        {isBrisbaneOrSeq(suburb.region) ? (
          <a className="cta" href="https://jilawater.com" target="_blank" rel="noreferrer">
            Jila Water (Brisbane/SEQ only CTA)
          </a>
        ) : (
          <p className="muted">Jila Water CTA is intentionally hidden outside Brisbane/SEQ.</p>
        )}
      </section>
    </main>
  );
};
