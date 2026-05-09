import type { ValueWithMeta } from './dataModels';

export const canDisplayExactValue = (row: ValueWithMeta) => Boolean(
  row.isExactValue && row.value && row.unit && row.source.url && row.source.publisher && row.source.publicationDate && row.coverageLevel && row.confidence,
);
