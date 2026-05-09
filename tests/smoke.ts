import assert from 'node:assert/strict';
import { buildSeoMeta, shouldIndexPage } from '../src/seo';
import { canDisplayExactValue } from '../src/dataHonesty';
import { locationProfiles } from '../src/seedData';

assert.equal(shouldIndexPage('Medium', true), true);
assert.equal(shouldIndexPage('Low', true), false);
assert.equal(buildSeoMeta('Australia', 'Unknown', false).robots, 'noindex,follow');

const sourced = {
  label: 'Hardness', value: '100', unit: 'mg/L', isExactValue: true, confidence: 'High' as const, coverageLevel: 'Exact suburb' as const,
  source: { title: 'x', humanLabel: 'Official water authority report', sourceType: 'pdf_report' as const, publisher: 'Seqwater', publicationDate: '2026-03-31', lastChecked: '2026-05-09', coverageLevel: 'Exact suburb' as const, confidence: 'High' as const, url: 'https://example.com' },
};
assert.equal(canDisplayExactValue(sourced), true);
assert.equal(canDisplayExactValue({ ...sourced, source: { ...sourced.source, publicationDate: undefined } }), false);
assert.ok(locationProfiles.find((p) => p.suburb === 'Brisbane CBD'));
assert.ok(locationProfiles.find((p) => p.suburb === 'South Brisbane'));
assert.ok(locationProfiles.find((p) => p.suburb === 'West End'));
assert.ok(locationProfiles.find((p) => p.suburb === 'Caboolture'));

console.log('smoke tests passed');
