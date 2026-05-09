import { seqSearchIndex } from './data/seqSearchIndex';
import type { MatchResult, SearchIndexEntry } from './dataModels';

const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
const ns = (s: string) => normalize(s).replace(/\s/g, '');
const dist = (a: string, b: string) => Math.abs(a.length - b.length) + [...a].filter((c, i) => c !== b[i]).length;

export function lookup(query: string): MatchResult {
  const q = normalize(query);
  if (!q) return { type: 'unknown', suggestions: [] };
  if (/^\d{4}$/.test(q)) {
    const entries = seqSearchIndex.filter((e) => e.postcode === q);
    if (entries.length === 1) return { type: 'single', entry: entries[0] };
    if (entries.length > 1) return { type: 'postcode_multiple', postcode: q, entries };
    return { type: 'unknown', suggestions: [] };
  }
  const exact = seqSearchIndex.find((e) => [e.suburb, ...e.aliases, e.regionGroup].some((v) => normalize(v) === q));
  if (exact) return { type: 'single', entry: exact };

  const partial = seqSearchIndex.filter((e) => [e.suburb, ...e.aliases, e.regionGroup].some((v) => normalize(v).includes(q) || ns(v).includes(ns(q))));
  if (partial.length === 1) return { type: 'single', entry: partial[0] };

  const fuzzy = seqSearchIndex
    .map((e) => ({ e, score: Math.min(...[e.suburb, ...e.aliases].map((v) => dist(normalize(v), q))) }))
    .filter((x) => x.score <= 3)
    .sort((a, b) => a.score - b.score || b.e.searchPriority - a.e.searchPriority)
    .map((x) => x.e);

  return { type: 'unknown', suggestions: dedupeBySuburb(partial.length ? partial : fuzzy).slice(0, 5) };
}

function dedupeBySuburb(items: SearchIndexEntry[]) {
  return items.filter((x, i, arr) => arr.findIndex((y) => y.suburb === x.suburb) === i);
}
