import assert from 'node:assert/strict';
import { buildSeoMeta, shouldIndexPage } from '../src/seo';

assert.equal(shouldIndexPage('Medium', true), true);
assert.equal(shouldIndexPage('Low', true), false);
assert.equal(shouldIndexPage('High', false), false);
assert.equal(buildSeoMeta('Brisbane 4101', 'Unknown', false).robots, 'noindex,follow');

console.log('smoke tests passed');
