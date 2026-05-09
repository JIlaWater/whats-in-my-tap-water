import { useEffect, useMemo, useState } from 'react';
import { authorities, reports, suburbMappings, suburbs, supplyZones } from './seedData';
import { getReviewedWaterData } from './sourceBackedData/getReviewedWaterData';

const SAMPLE_LABEL = 'SAMPLE / PLACEHOLDER DATA ONLY';
const SITE_NAME = 'WhatsInMyTapWater.com';
const HERO_MASCOT_LOCAL = '/images/kangaroo-water-mascot.webp';
const HERO_MASCOT_REMOTE_FALLBACK = 'https://jilawater.com.au/wp-content/uploads/2026/05/kangaroo-water-mascot.webp';
const SUGGESTED_SUBURB_IDS = [
  'au-qld-south-brisbane-4101',
  'au-qld-new-farm-4005',
  'au-qld-west-end-4101',
  'au-qld-carindale-4152',
  'au-qld-north-lakes-4509',
] as const;

const slugFor = (suburbId: string) => suburbId;

type Route =
  | { type: 'home' }
  | { type: 'report'; suburbId: string }
  | { type: 'privacy' }
  | { type: 'methodology' }
  | { type: 'notFound' };

const getRoute = (): Route => {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts.length === 0) return { type: 'home' };
  if (parts[0] === 'report' && parts[1]) return { type: 'report', suburbId: parts[1] };
  if (parts[0] === 'privacy') return { type: 'privacy' };
  if (parts[0] === 'methodology') return { type: 'methodology' };
  return { type: 'notFound' };
};

const isBrisbaneOrSeq = (region: string): boolean => ['brisbane', 'seq'].includes(region.toLowerCase());

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

export const App = () => {
  const [query, setQuery] = useState('');
  const [route, setRoute] = useState<Route>(() => getRoute());
  const [heroSrc, setHeroSrc] = useState(HERO_MASCOT_LOCAL);
  const [showHeroImage, setShowHeroImage] = useState(true);

  useEffect(() => {
    const onPop = () => setRoute(getRoute());
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
  const hasSearchNoResults = query.trim().length > 0 && suggestions.length === 0;
  const suggestedSuburbs = useMemo(
    () => SUGGESTED_SUBURB_IDS.map((id) => suburbs.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [],
  );

  const activeSuburbId = route.type === 'report' ? route.suburbId : suburbs[0]?.id;
  const suburb = suburbs.find((s) => s.id === activeSuburbId);
  const mapping = suburbMappings.find((m) => m.suburbId === activeSuburbId);
  const authority = authorities.find((a) => a.id === mapping?.authorityId);
  const supplyZone = supplyZones.find((z) => z.id === mapping?.supplyZoneId);
  const report = reports.find((r) => r.suburbId === activeSuburbId);
  const reviewedRecords = suburb && mapping ? getReviewedWaterData(suburb, mapping) : [];
  const hasReviewedRecords = reviewedRecords.length > 0;

  const reportUrl = suburb ? `${window.location.origin}/report/${slugFor(suburb.id)}` : window.location.href;

  useEffect(() => {
    if (route.type === 'privacy') {
      document.title = `Privacy & Disclaimer | ${SITE_NAME}`;
      setMeta('description', 'Privacy and disclaimer information for WhatsInMyTapWater.com. This site currently displays sample placeholder data only.');
      return;
    }
    if (route.type === 'methodology') {
      document.title = `Methodology | ${SITE_NAME}`;
      setMeta('description', 'Methodology for sample suburb water reports on WhatsInMyTapWater.com, including placeholder data handling and confidence labels.');
      return;
    }
    if (route.type === 'notFound') {
      document.title = `Page not found | ${SITE_NAME}`;
      setMeta('description', 'The page you requested was not found.');
      return;
    }

    if (!suburb) return;
    document.title = `${suburb.suburb} Tap Water Report (${SAMPLE_LABEL}) | ${SITE_NAME}`;
    setMeta('description', `${suburb.suburb} ${suburb.postcode} tap water report with sample placeholder values, freshness and confidence badges.`);
    setMeta('og:title', `${suburb.suburb} Tap Water Snapshot (${SAMPLE_LABEL})`, true);
    setMeta('og:description', `Shareable suburb report for ${suburb.suburb}. All values are currently sample placeholder data only.`, true);
    setMeta('og:url', reportUrl, true);

    let script = document.getElementById('suburb-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'suburb-jsonld';
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      webPage: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${suburb.suburb} Tap Water Report (${SAMPLE_LABEL})`,
        url: reportUrl,
        description: `Placeholder suburb water report for ${suburb.suburb} ${suburb.postcode}.`,
      },
    });
  }, [route.type, suburb, suburb?.suburb, suburb?.postcode, reportUrl]);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(getRoute());
  };

  const openReport = (suburbId: string) => navigate(`/report/${slugFor(suburbId)}`);

  if (route.type === 'privacy') {
    return <main className="layout"><h1>Privacy & Disclaimer</h1><p>This website currently presents sample/placeholder data only and does not provide live utility measurements.</p><p>Information is for product preview purposes and is not health, legal, or engineering advice.</p><p>Commercial references to Jila Water are limited to Brisbane/SEQ context and are shown transparently as referral CTAs.</p><p><button onClick={() => navigate('/')}>Back to reports</button></p></main>;
  }

  if (route.type === 'methodology') {
    return <main className="layout"><h1>Methodology</h1><p>All suburb values are sample placeholders for MVP testing. No live readings are currently ingested.</p><p>Confidence and freshness badges indicate demo logic and should not be treated as certified water compliance statements.</p><p>Future production data should include source timestamping, authority attribution, and clear QA workflows.</p><p><button onClick={() => navigate('/')}>Back to reports</button></p></main>;
  }

  if (route.type === 'notFound') {
    return <main className="layout"><h1>404 — Page not found</h1><p>We could not find that page. Use the button below to return to the report directory.</p><p><button onClick={() => navigate('/')}>Go to homepage</button></p></main>;
  }

  if (!suburb || !mapping || !authority || !supplyZone || !report) {
    return <main className="layout">Unable to load sample report data.</main>;
  }

  return (
    <main className="layout">
      <p className="topBanner"><strong>BETA DATA NOTICE</strong> — Some Brisbane records are reviewed source-backed authority-level data. Unsupported suburbs may still show sample placeholders. Not individual household tap testing.</p>

      <header className="hero card">
        <div className="heroContent">
          <div className="heroCopy">
            <h1>What’s Really In Your Tap Water?</h1>
            <p className="subheading">Enter your suburb or postcode for a free plain-English tap water report.</p>
            <p className="betaNote">Beta preview: reviewed Brisbane authority-level data is being added first. Some suburbs still use sample placeholders while coverage is built.</p>
          </div>
          {showHeroImage ? (
            <figure className="heroMascot">
              <img
                src={heroSrc}
                alt="Friendly Australian kangaroo mascot drinking a glass of water with the Australian flag draped over its shoulders."
                loading="eager"
                decoding="async"
                onError={() => {
                  if (heroSrc === HERO_MASCOT_LOCAL) {
                    setHeroSrc(HERO_MASCOT_REMOTE_FALLBACK);
                    return;
                  }
                  setShowHeroImage(false);
                }}
              />
            </figure>
          ) : null}
        </div>
      </header>

      <section className="searchPanel card">
        <h2>Search suburb or postcode</h2>
        <input placeholder="Try South Brisbane or 4101" value={query} onChange={(e) => setQuery(e.target.value)} />
        {suggestions.length > 0 ? (
          <div className="chips">{suggestions.map((s) => <button key={s.id} onClick={() => openReport(s.id)}>{s.suburb} ({s.postcode})</button>)}</div>
        ) : (
          <div className="searchNoResults">
            <p><strong>We don’t have that suburb in the beta dataset yet.</strong></p>
            <p>This beta currently includes selected Brisbane/SEQ suburbs while source-backed coverage is being built.</p>
            <p>No match for “{query.trim()}”. Current report remains <strong>{suburb.suburb}</strong> until you select a suburb below.</p>
            <p>The report below is your currently selected report, not a match for your search.</p>
            <div className="chips">{suggestedSuburbs.map((s) => <button key={s.id} onClick={() => openReport(s.id)}>{s.suburb} ({s.postcode})</button>)}</div>
          </div>
        )}
      </section>

      <section className="card snapshot" aria-label="Tap Water Snapshot">
        {hasSearchNoResults ? <p className="kicker">Currently selected report</p> : null}
        <p className="kicker">Tap Water Snapshot</p>
        <h2>{suburb.suburb}, {suburb.state} {suburb.postcode}</h2>
        <div className="badges">
          <span className="badge trust">Source: {authority.name}</span>
          <span className="badge trust">Zone: {supplyZone.displayName}</span>
          <span className="badge">Confidence: {report.confidence.level} ({report.confidence.scoreOutOf100}/100)</span>
          <span className="badge">Freshness: {report.sourceFreshness.staleness}</span>
          {hasReviewedRecords ? (
            <>
              <span className="badge trust">Reviewed source-backed data</span>
              <span className="badge trust">Coverage: Brisbane authority-level</span>
              <span className="badge">Confidence: medium</span>
              <span className="badge warn">Not individual tap testing</span>
            </>
          ) : (
            <>
              <span className="badge warn">Sample / placeholder data only</span>
              <span className="badge warn">No {suburb.suburb}-specific source-backed data is currently displayed</span>
              <span className="badge warn">Beta coverage is being built</span>
            </>
          )}
        </div>
        {hasReviewedRecords ? (
          <>
            <p><strong>Source:</strong> Seqwater Brisbane Monthly Water Quality Report — March 2026</p>
            <p><em>Authority-level monthly data, not a test from your individual tap.</em></p>
            <details className="sourceDetails">
              <summary><strong>Source details</strong></summary>
              <div className="sourceDetailsCard">
                <ul>
                  <li><strong>Source:</strong> Seqwater Brisbane Monthly Water Quality Report — March 2026</li>
                  <li><strong>Source owner:</strong> Seqwater</li>
                  <li><strong>Source type:</strong> downloadable_pdf</li>
                  <li><strong>Report month:</strong> March 2026</li>
                  <li><strong>Coverage level:</strong> Brisbane authority-level</li>
                  <li><strong>Confidence level:</strong> medium</li>
                  <li><strong>Review status:</strong> reviewed</li>
                  <li><strong>Reviewer initials:</strong> JG</li>
                  <li><strong>Review date:</strong> 2026-05-09</li>
                  <li><strong>Source file:</strong> <code>data/source-files/seqwater/Seqwater Water Quality Report - Brisbane - 2026-03.pdf</code></li>
                </ul>
                <p><em>Authority-level monthly water quality data. Not a test from your individual household tap.</em></p>
              </div>
            </details>
            <ul>{reviewedRecords.map((record) => <li key={record.record_id}><strong>{record.parameter_name}:</strong> min {record.min_value}, avg {record.average_value}, max {record.max_value} {record.unit} (samples: {record.number_of_samples})</li>)}</ul>
          </>
        ) : (
          <ul>{report.parameters.map((param) => <li key={param.key}><strong>{param.displayName}:</strong> {param.placeholderValue} {param.unit} <em>(sample/placeholder)</em></li>)}</ul>
        )}
      </section>

      {isBrisbaneOrSeq(suburb.region) ? (
        <section className="card ctaCard">
          <h3>Jila Water for Brisbane/SEQ households</h3>
          <p>Explore water treatment options for Brisbane and South East Queensland households.</p>
          <a className="cta" href="https://jilawater.com.au/free-home-water-assessment/?utm_source=whats_in_my_tap_water&utm_medium=referral&utm_campaign=suburb_water_report&utm_content=seq_cta" target="_blank" rel="noreferrer">Book a Free Jila Water Assessment</a>
        </section>
      ) : (
        <section className="card ctaCard neutral">
          <h3>Local information only</h3>
          <p>This suburb is outside Brisbane/SEQ, so no Jila referral is shown. Please check your local council and water authority resources.</p>
        </section>
      )}

      <footer className="card footer">
        <p className="footerWarning"><strong>Warning:</strong> This beta may show reviewed authority-level data for selected Brisbane suburbs and sample placeholders elsewhere. Not live utility data or individual household tap testing.</p>
        <div className="footerLinks">
          <button onClick={() => navigate('/methodology')}>Methodology</button>
          <button onClick={() => navigate('/privacy')}>Privacy & disclaimer</button>
        </div>
        <p className="muted">Built by <a href="https://jilawater.com.au/" target="_blank" rel="noreferrer">Jila Water</a> as a free Australian homeowner education project.</p>
      </footer>
    </main>
  );
};
