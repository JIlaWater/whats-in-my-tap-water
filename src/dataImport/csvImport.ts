import type { CoverageLevel, ImportValidationIssue, ReviewStatus, SourceReferenceRecord } from './types';

const requiredCoverageLevels: CoverageLevel[] = ['suburb', 'postcode', 'supply_zone', 'authority', 'council', 'state'];
const validStatuses: ReviewStatus[] = ['sample', 'imported', 'reviewed', 'publishable', 'published'];
const validCoverageSet = new Set(requiredCoverageLevels);

export const parseCsv = (raw: string): Record<string, string>[] => {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? '';
      return acc;
    }, {});
  });
};

const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export const validateSourceReferenceRecord = (record: Partial<SourceReferenceRecord>, rowNumber: number): ImportValidationIssue[] => {
  const issues: ImportValidationIssue[] = [];

  if (!record.sourceUrl) issues.push({ rowNumber, field: 'sourceUrl', message: 'source URL is required.' });
  if (!record.publicationDate) issues.push({ rowNumber, field: 'publicationDate', message: 'publication date is required.' });
  if (!record.lastCheckedDate) issues.push({ rowNumber, field: 'lastCheckedDate', message: 'last checked date is required.' });
  if (!record.confidenceLevel) issues.push({ rowNumber, field: 'confidenceLevel', message: 'confidence level is required.' });
  if (!record.coverageLevel) issues.push({ rowNumber, field: 'coverageLevel', message: 'coverage level is required.' });

  if (record.publicationDate && !isIsoDate(record.publicationDate)) {
    issues.push({ rowNumber, field: 'publicationDate', message: 'publication date must use YYYY-MM-DD format.' });
  }
  if (record.lastCheckedDate && !isIsoDate(record.lastCheckedDate)) {
    issues.push({ rowNumber, field: 'lastCheckedDate', message: 'last checked date must use YYYY-MM-DD format.' });
  }

  if (record.coverageLevel && !validCoverageSet.has(record.coverageLevel)) {
    issues.push({ rowNumber, field: 'coverageLevel', message: `coverage level must be one of: ${requiredCoverageLevels.join(', ')}.` });
  }

  if (record.reviewStatus && !validStatuses.includes(record.reviewStatus)) {
    issues.push({ rowNumber, field: 'reviewStatus', message: `review status must be one of: ${validStatuses.join(', ')}.` });
  }

  return issues;
};

export const mapSourceReferenceRecord = (row: Record<string, string>): SourceReferenceRecord => ({
  sourceReferenceId: row.source_reference_id,
  sourceName: row.source_name,
  authorityId: row.authority_id,
  sourceUrl: row.source_url,
  documentTitle: row.document_title,
  publicationDate: row.publication_date,
  lastCheckedDate: row.last_checked_date,
  confidenceLevel: row.confidence_level as SourceReferenceRecord['confidenceLevel'],
  coverageLevel: row.coverage_level as SourceReferenceRecord['coverageLevel'],
  councilName: row.council_name,
  state: row.state,
  reviewStatus: row.review_status as SourceReferenceRecord['reviewStatus'],
  notes: row.notes,
});
