import type { SearchResult } from './dataModels';
import { locationProfiles } from './seedData';

const normalize = (v: string) => v.trim().toLowerCase();
const distance1 = (a: string, b: string) => Math.abs(a.length - b.length) <= 1 && [...a].filter((ch, i) => ch !== b[i]).length <= 2;

export const searchProfiles = (query: string): SearchResult => {
  const q = normalize(query);
  if (!q) return { query, status: 'empty', matchedType: 'none', profiles: [], suggestions: [] };
  const exact = locationProfiles.filter((p) => p.postcode === q || normalize(p.suburb) === q || p.aliases.some((a) => normalize(a) === q));
  if (exact.length) return { query, status: exact.length > 1 ? 'multiple' : 'single', matchedType: 'suburb', profiles: exact, suggestions: [] };
  const partial = locationProfiles.filter((p) => normalize(p.suburb).includes(q) || p.aliases.some((a) => normalize(a).includes(q)));
  if (partial.length) return { query, status: partial.length > 1 ? 'multiple' : 'single', matchedType: 'partial', profiles: partial, suggestions: [] };
  const fuzzy = locationProfiles.filter((p) => distance1(normalize(p.suburb), q) || p.aliases.some((a) => distance1(normalize(a), q) || normalize(a).startsWith(q) || q.startsWith(normalize(a).slice(0, 4))));
  if (fuzzy.length) return { query, status: 'unknown', matchedType: 'fuzzy', profiles: [], suggestions: fuzzy.map((p) => p.suburb) };
  return { query, status: 'unknown', matchedType: 'none', profiles: [], suggestions: [] };
};
