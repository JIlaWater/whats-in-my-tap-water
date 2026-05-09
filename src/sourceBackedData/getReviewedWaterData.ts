import type { LocationAuthorityMapping, AustralianSuburb } from '../dataModels';
import { brisbaneMarch2026ReviewedData, type ReviewedWaterRecord } from './brisbaneMarch2026';
import { moretonMarch2026ReviewedData } from './moretonMarch2026';

const BLOCKED_STATUSES = new Set(['imported', 'sample', 'rejected', 'publishable', 'published']);

const filterSafeReviewed = (records: ReviewedWaterRecord[]) =>
  records.filter((record) => record.review_status === 'reviewed' && !BLOCKED_STATUSES.has(record.review_status));

const MORETON_REVIEWED_SUBURBS = new Set([
  'au-qld-north-lakes-4509',
  'au-qld-redcliffe-4020',
  'au-qld-caboolture-4510',
]);

export const getReviewedWaterData = (
  suburb: AustralianSuburb,
  mapping: LocationAuthorityMapping,
): ReviewedWaterRecord[] => {
  const suburbId = suburb.id;

  const supportsBrisbane = ['brisbane', 'seq'].includes(suburb.region.toLowerCase()) && mapping.authorityId === 'urban-utilities';
  if (supportsBrisbane) {
    return filterSafeReviewed(brisbaneMarch2026ReviewedData);
  }

  const supportsMoreton =
    ['seq', 'moreton'].includes(suburb.region.toLowerCase())
    && mapping.authorityId === 'unitywater'
    && MORETON_REVIEWED_SUBURBS.has(suburbId);

  if (supportsMoreton) {
    return filterSafeReviewed(moretonMarch2026ReviewedData);
  }

  return [];
};
