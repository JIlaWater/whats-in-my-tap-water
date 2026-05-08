import type { CoverageLevel, ImportValidationIssue, ReviewStatus, SourceReferenceRecord } from './types';

const requiredCoverageLevels: CoverageLevel[] = ['suburb', 'postcode', 'supply_zone', 'authority', 'council', 'state'];
const validStatuses: ReviewStatus[] = ['sample', 'imported', 'reviewed', 'publishable', 'published'];
const validConfidenceLevels = new Set(['low', 'medium', 'high']);
const validCoverageSet = new Set(requiredCoverageLevels);
const validStatusSet = new Set(validStatuses);

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const splitCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

export const parseCsv = (raw: string): Record<string, string>[] => {
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? '';
      return acc;
    }, {});
  });
};

const isIsoDate = (value: string) => datePattern.test(value);

const addIssue = (issues: ImportValidationIssue[], rowNumber: number, field: string, message: string) => {
  issues.push({ rowNumber, field, message });
};

const addRequiredField = (
  value: string | undefined,
  issues: ImportValidationIssue[],
  rowNumber: number,
  field: string,
  message: string,
) => {
  if (!value) addIssue(issues, rowNumber, field, message);
};

const validateSharedSourceFields = (record: Record<string, string>, rowNumber: number): ImportValidationIssue[] => {
  const issues: ImportValidationIssue[] = [];

  addRequiredField(record.source_url, issues, rowNumber, 'source_url', 'source URL is required.');
  addRequiredField(record.publication_date, issues, rowNumber, 'publication_date', 'publication date is required.');
  addRequiredField(record.last_checked_date, issues, rowNumber, 'last_checked_date', 'last checked date is required.');
  addRequiredField(record.confidence_level, issues, rowNumber, 'confidence_level', 'confidence level is required.');
  addRequiredField(record.coverage_level, issues, rowNumber, 'coverage_level', 'coverage level is required.');

  if (record.source_url && !record.source_url.startsWith('http')) {
    addIssue(issues, rowNumber, 'source_url', 'source URL must start with http:// or https://.');
  }

  if (record.publication_date && !isIsoDate(record.publication_date)) {
    addIssue(issues, rowNumber, 'publication_date', 'publication date must use YYYY-MM-DD format.');
  }
  if (record.last_checked_date && !isIsoDate(record.last_checked_date)) {
    addIssue(issues, rowNumber, 'last_checked_date', 'last checked date must use YYYY-MM-DD format.');
  }

  if (record.confidence_level && !validConfidenceLevels.has(record.confidence_level)) {
    addIssue(issues, rowNumber, 'confidence_level', 'confidence level must be one of: low, medium, high.');
  }

  if (record.coverage_level && !validCoverageSet.has(record.coverage_level as CoverageLevel)) {
    addIssue(issues, rowNumber, 'coverage_level', `coverage level must be one of: ${requiredCoverageLevels.join(', ')}.`);
  }

  if (record.review_status && !validStatusSet.has(record.review_status as ReviewStatus)) {
    addIssue(issues, rowNumber, 'review_status', `review status must be one of: ${validStatuses.join(', ')}.`);
  }

  if ((record.review_status === 'publishable' || record.review_status === 'published') && record.confidence_level === 'low') {
    addIssue(issues, rowNumber, 'confidence_level', 'publishable/published rows must not use low confidence.');
  }

  return issues;
};

export const validateSourceReferenceRecord = (record: Partial<SourceReferenceRecord>, rowNumber: number): ImportValidationIssue[] =>
  validateSharedSourceFields(
    {
      source_url: record.sourceUrl ?? '',
      publication_date: record.publicationDate ?? '',
      last_checked_date: record.lastCheckedDate ?? '',
      confidence_level: record.confidenceLevel ?? '',
      coverage_level: record.coverageLevel ?? '',
      review_status: record.reviewStatus ?? '',
    },
    rowNumber,
  );

export const validateWaterQualityParameterRow = (record: Record<string, string>, rowNumber: number): ImportValidationIssue[] => {
  const issues = validateSharedSourceFields(record, rowNumber);

  if ((record.review_status === 'publishable' || record.review_status === 'published') && !record.value_numeric) {
    addIssue(issues, rowNumber, 'value_numeric', 'publishable/published rows require a numeric value.');
  }

  return issues;
};

export const validateEntityLinkageRow = (record: Record<string, string>, rowNumber: number): ImportValidationIssue[] => {
  const issues: ImportValidationIssue[] = [];

  addRequiredField(record.coverage_level, issues, rowNumber, 'coverage_level', 'coverage level is required.');
  addRequiredField(record.review_status, issues, rowNumber, 'review_status', 'review status is required.');

  if (record.coverage_level && !validCoverageSet.has(record.coverage_level as CoverageLevel)) {
    addIssue(issues, rowNumber, 'coverage_level', `coverage level must be one of: ${requiredCoverageLevels.join(', ')}.`);
  }

  if (record.review_status && !validStatusSet.has(record.review_status as ReviewStatus)) {
    addIssue(issues, rowNumber, 'review_status', `review status must be one of: ${validStatuses.join(', ')}.`);
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
