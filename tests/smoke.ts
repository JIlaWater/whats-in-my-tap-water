import assert from 'node:assert/strict';
import { buildSeoMeta, shouldIndexPage } from '../src/seo';
import { locationProfiles } from '../src/seedData';
import { searchProfiles } from '../src/search';

assert.equal(shouldIndexPage('Medium', true), true);
assert.equal(shouldIndexPage('Low', true), false);
assert.equal(buildSeoMeta('Australia', 'Unknown', false).robots, 'noindex,follow');

const cases = ['Brisbane', '4000', 'South Brisbane', '4101', 'West End', 'Caboolture', '4510', 'Ipswich', 'Gold Coast', 'Nunda', 'Nundah', '9999', 'fake suburb', ''];
for (const c of cases) {
  const r = searchProfiles(c);
  if (c === '') assert.equal(r.status, 'empty');
  if (c === '4101') assert.equal(r.status, 'multiple');
  if (c === 'Nunda') assert.ok(r.profiles.some((p) => p.suburb === 'Nundah') || r.suggestions.includes('Nundah'));
  if (c === '9999' || c === 'fake suburb') assert.equal(r.status, 'unknown');
}

assert.ok(locationProfiles.every((p) => p.sources.every((s) => ['Official water authority report', 'Government drinking water guidance', 'Source under review'].includes(s.humanLabel))));
assert.ok(locationProfiles.every((p) => p.shareSummary.length > 0 && p.socialPost.length > 0));
assert.ok(locationProfiles.filter((p) => ['Brisbane CBD', 'South Brisbane', 'West End', 'Caboolture'].includes(p.suburb)).every((p) => p.confidence === 'Medium'));
console.log('smoke tests passed');
