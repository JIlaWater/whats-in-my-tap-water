import type { Confidence } from './dataModels';

export const shouldIndexPage = (confidence: Confidence, hasSubstantialContent: boolean) => hasSubstantialContent && (confidence === 'High' || confidence === 'Medium');

export const buildSeoMeta = (locationLabel: string, confidence: Confidence, hasSubstantialContent: boolean) => ({
  title: locationLabel === 'Australia' ? "What’s In My Tap Water? Postcode Water Quality Lookup Australia" : `${locationLabel} Tap Water Snapshot | What's In My Tap Water?`,
  description: 'Enter your suburb or postcode to see a plain-English tap-water snapshot including local water authority, likely source, treatment context, taste and scale watchlist, sources and testing suggestions.',
  robots: shouldIndexPage(confidence, hasSubstantialContent) ? 'index,follow' : 'noindex,follow',
});
