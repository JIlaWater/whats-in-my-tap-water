type PlaceholderWaterReport = {
  suburb: string;
  region: string;
  provider: string;
  source: string;
  updatedAt: string;
  hardnessMgL: number;
  chlorineMgL: number;
  ph: number;
  note: string;
};

const SAMPLE_REPORTS: PlaceholderWaterReport[] = [
  {
    suburb: 'South Brisbane',
    region: 'Brisbane',
    provider: 'Sample Utility Dataset',
    source: 'Placeholder/Sample Data',
    updatedAt: '2026-05-01',
    hardnessMgL: 48,
    chlorineMgL: 0.62,
    ph: 7.4,
    note: 'Sample values only. Not live, certified, or user-specific.',
  },
  {
    suburb: 'Chermside',
    region: 'SEQ',
    provider: 'Sample Utility Dataset',
    source: 'Placeholder/Sample Data',
    updatedAt: '2026-05-01',
    hardnessMgL: 52,
    chlorineMgL: 0.58,
    ph: 7.3,
    note: 'Sample values only. Not live, certified, or user-specific.',
  },
  {
    suburb: 'Geelong',
    region: 'Victoria',
    provider: 'Sample Utility Dataset',
    source: 'Placeholder/Sample Data',
    updatedAt: '2026-05-01',
    hardnessMgL: 90,
    chlorineMgL: 0.43,
    ph: 7.7,
    note: 'Sample values only. Not live, certified, or user-specific.',
  },
];

const isBrisbaneOrSeq = (region: string): boolean => {
  const normal = region.toLowerCase();
  return normal.includes('brisbane') || normal.includes('seq');
};

export const App = () => {
  return (
    <main className="layout">
      <h1>WhatsInMyTapWater.com MVP</h1>
      <p className="banner">
        Every value below is clearly labelled <strong>placeholder/sample data</strong>.
        No live water network feed is used in this MVP.
      </p>

      <section>
        <h2>Suburb Snapshot (Placeholder/Sample Data)</h2>
        <div className="grid">
          {SAMPLE_REPORTS.map((report) => (
            <article className="card" key={report.suburb}>
              <h3>{report.suburb}</h3>
              <p>
                <strong>Region:</strong> {report.region}
              </p>
              <p>
                <strong>Provider:</strong> {report.provider}
              </p>
              <p>
                <strong>Source Label:</strong> {report.source}
              </p>
              <ul>
                <li>Hardness: {report.hardnessMgL} mg/L</li>
                <li>Chlorine: {report.chlorineMgL} mg/L</li>
                <li>pH: {report.ph}</li>
              </ul>
              <p className="note">{report.note}</p>

              {isBrisbaneOrSeq(report.region) ? (
                <a className="cta" href="https://jilawater.com" target="_blank" rel="noreferrer">
                  Jila Water (Brisbane/SEQ only CTA)
                </a>
              ) : (
                <p className="muted">Jila Water CTA intentionally hidden outside Brisbane/SEQ.</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
