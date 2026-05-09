import type { ConfidenceLevel } from './dataModels';

export const shouldIndexPage = (confidence: ConfidenceLevel, hasSubstantialContent: boolean) => {
  if (!hasSubstantialContent) return false;
  return confidence === 'High' || confidence === 'Medium';
};

export const buildSeoMeta = (locationLabel: string, confidence: ConfidenceLevel, hasSubstantialContent: boolean) => ({
  title: `${locationLabel} Tap Water Report | What's In My Tap Water?`,
  description: `Plain-English ${locationLabel} tap water report based on public authority data with confidence and source transparency.`,
  canonical: `${'https://whatsinmytapwater.com'}/report/${encodeURIComponent(locationLabel.toLowerCase().replace(/\s+/g, '-'))}`,
  robots: shouldIndexPage(confidence, hasSubstantialContent) ? 'index,follow' : 'noindex,follow',
});
