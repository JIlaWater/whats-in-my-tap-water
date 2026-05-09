import type { LocationAuthorityMapping, AustralianSuburb } from '../dataModels';
import { brisbaneMarch2026ReviewedData, type ReviewedWaterRecord } from './brisbaneMarch2026';

const BLOCKED_STATUSES = new Set(['imported', 'sample', 'rejected', 'publishable', 'published']);

export const getReviewedWaterData = (
  suburb: AustralianSuburb,
  mapping: LocationAuthorityMapping,
): ReviewedWaterRecord[] => {
  const isSupported = ['brisbane', 'seq'].includes(suburb.region.toLowerCase()) && mapping.authorityId === 'urban-utilities';

  if (!isSupported) {
    return [];
  }

  return brisbaneMarch2026ReviewedData.filter(
    (record) => record.review_status === 'reviewed' && !BLOCKED_STATUSES.has(record.review_status),
  );
};
