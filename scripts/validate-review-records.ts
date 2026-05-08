import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

type Row = Record<string, string>;

type FieldSpec = {
  canonical: string;
  aliases: string[];
};

type Issue = {
  row: number;
  field: string;
  message: string;
};

const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;
const URL_REGEX = /^https?:\/\//i;

const REVIEWED_FIELDS: FieldSpec[] = [
  { canonical: 'record_id', aliases: ['record_id'] },
  { canonical: 'source_url', aliases: ['source_url'] },
  { canonical: 'publication_date', aliases: ['publication_date'] },
  { canonical: 'last_checked_date', aliases: ['last_checked_date'] },
  { canonical: 'source_owner', aliases: ['source_owner', 'region'] },
  { canonical: 'parameter_name', aliases: ['parameter_name'] },
  { canonical: 'value_checked', aliases: ['value_checked', 'value'] },
  { canonical: 'unit_checked', aliases: ['unit_checked', 'unit'] },
  { canonical: 'coverage_level_confirmed', aliases: ['coverage_level_confirmed', 'coverage_level'] },
  { canonical: 'confidence_level_confirmed', aliases: ['confidence_level_confirmed', 'confidence_level'] },
  { canonical: 'reviewer_name_or_initials', aliases: ['reviewer_name_or_initials', 'reviewer_name'] },
  { canonical: 'review_date', aliases: ['review_date'] },
  { canonical: 'review_status', aliases: ['review_status'] },
  { canonical: 'reviewer_notes', aliases: ['reviewer_notes', 'review_notes'] },
];

const REJECTED_FIELDS: FieldSpec[] = [
  { canonical: 'record_id', aliases: ['record_id'] },
  { canonical: 'rejection_reason', aliases: ['rejection_reason'] },
  { canonical: 'reviewer_name_or_initials', aliases: ['reviewer_name_or_initials', 'reviewer_name'] },
  { canonical: 'review_date', aliases: ['review_date'] },
  { canonical: 'review_status', aliases: ['review_status', 'original_status'] },
];

function parseCsv(content: string): { headers: string[]; rows: Row[] } {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const parseLine = (line: string): string[] => {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const nextChar = line[index + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    cells.push(current.trim());
    return cells;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const cells = parseLine(line);
    const row: Row = {};
    headers.forEach((header, index) => {
      row[header] = (cells[index] ?? '').trim();
    });
    return row;
  });

  return { headers, rows };
}

function getFieldValue(row: Row, spec: FieldSpec): string {
  for (const alias of spec.aliases) {
    if (alias in row) {
      return row[alias];
    }
  }
  return '';
}

function hasHeader(headers: string[], spec: FieldSpec): boolean {
  return spec.aliases.some((alias) => headers.includes(alias));
}

function validateReviewed(rows: Row[], headers: string[]): Issue[] {
  const issues: Issue[] = [];

  for (const spec of REVIEWED_FIELDS) {
    if (!hasHeader(headers, spec)) {
      issues.push({ row: 0, field: spec.canonical, message: `Missing required column (accepted: ${spec.aliases.join(', ')})` });
    }
  }

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    for (const spec of REVIEWED_FIELDS) {
      const value = getFieldValue(row, spec);
      if (!value) {
        issues.push({ row: rowNumber, field: spec.canonical, message: 'Required field is missing' });
      }
    }

    const sourceUrl = getFieldValue(row, REVIEWED_FIELDS[1]);
    if (sourceUrl && !URL_REGEX.test(sourceUrl)) {
      issues.push({ row: rowNumber, field: 'source_url', message: 'Must start with http:// or https://' });
    }

    for (const dateField of ['publication_date', 'last_checked_date', 'review_date'] as const) {
      const spec = REVIEWED_FIELDS.find((item) => item.canonical === dateField)!;
      const value = getFieldValue(row, spec);
      if (value && !YYYY_MM_DD.test(value)) {
        issues.push({ row: rowNumber, field: dateField, message: 'Must use YYYY-MM-DD format' });
      }
    }

    const confidence = getFieldValue(row, REVIEWED_FIELDS[9]);
    if (confidence && !['low', 'medium', 'high'].includes(confidence)) {
      issues.push({ row: rowNumber, field: 'confidence_level_confirmed', message: 'Must be one of: low, medium, high' });
    }

    const coverage = getFieldValue(row, REVIEWED_FIELDS[8]);
    if (coverage && !['suburb', 'postcode', 'supply_zone', 'authority', 'council', 'state'].includes(coverage)) {
      issues.push({ row: rowNumber, field: 'coverage_level_confirmed', message: 'Must be one of: suburb, postcode, supply_zone, authority, council, state' });
    }

    const reviewStatus = getFieldValue(row, REVIEWED_FIELDS[12]);
    if (reviewStatus && !['reviewed', 'publishable', 'published'].includes(reviewStatus)) {
      issues.push({ row: rowNumber, field: 'review_status', message: 'Must be one of: reviewed, publishable, published' });
    }

    if (confidence === 'low' && ['publishable', 'published'].includes(reviewStatus)) {
      issues.push({ row: rowNumber, field: 'review_status', message: 'Low confidence records cannot be publishable or published' });
    }
  });

  return issues;
}

function validateRejected(rows: Row[], headers: string[]): Issue[] {
  const issues: Issue[] = [];

  for (const spec of REJECTED_FIELDS) {
    if (!hasHeader(headers, spec)) {
      issues.push({ row: 0, field: spec.canonical, message: `Missing required column (accepted: ${spec.aliases.join(', ')})` });
    }
  }

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    for (const spec of REJECTED_FIELDS) {
      const value = getFieldValue(row, spec);
      if (!value) {
        issues.push({ row: rowNumber, field: spec.canonical, message: 'Required field is missing' });
      }
    }

    const reviewStatus = getFieldValue(row, REJECTED_FIELDS[4]);
    if (reviewStatus && !['rejected', 'imported'].includes(reviewStatus)) {
      issues.push({ row: rowNumber, field: 'review_status', message: 'Must be one of: rejected, imported' });
    }

    if (['publishable', 'published'].includes(reviewStatus)) {
      issues.push({ row: rowNumber, field: 'review_status', message: 'Rejected records cannot be publishable or published' });
    }

    const reviewDate = getFieldValue(row, REJECTED_FIELDS[3]);
    if (reviewDate && !YYYY_MM_DD.test(reviewDate)) {
      issues.push({ row: rowNumber, field: 'review_date', message: 'Must use YYYY-MM-DD format' });
    }
  });

  return issues;
}

function report(filePath: string, rows: Row[], issues: Issue[]): boolean {
  const invalidRows = new Set(issues.filter((issue) => issue.row > 0).map((issue) => issue.row));
  const validRows = rows.length - invalidRows.size;

  console.log(`\n=== ${filePath} ===`);
  console.log(`Rows checked: ${rows.length}`);
  console.log(`Valid rows: ${validRows}`);
  console.log(`Invalid rows: ${invalidRows.size}`);

  if (issues.length === 0) {
    console.log('Issues: none');
    console.log('Result: PASS');
    return true;
  }

  console.log('Issues:');
  for (const issue of issues) {
    const rowLabel = issue.row === 0 ? 'header' : `row ${issue.row}`;
    console.log(`- ${rowLabel}, field "${issue.field}": ${issue.message}`);
  }
  console.log('Result: FAIL');
  return false;
}

function run(): void {
  const reviewedPath = path.resolve('data/review/reviewed-records-template.csv');
  const rejectedPath = path.resolve('data/review/rejected-records-template.csv');

  const reviewedCsv = parseCsv(readFileSync(reviewedPath, 'utf8'));
  const rejectedCsv = parseCsv(readFileSync(rejectedPath, 'utf8'));

  const reviewedIssues = validateReviewed(reviewedCsv.rows, reviewedCsv.headers);
  const rejectedIssues = validateRejected(rejectedCsv.rows, rejectedCsv.headers);

  const reviewedPass = report('data/review/reviewed-records-template.csv', reviewedCsv.rows, reviewedIssues);
  const rejectedPass = report('data/review/rejected-records-template.csv', rejectedCsv.rows, rejectedIssues);

  const pass = reviewedPass && rejectedPass;
  console.log(`\nOverall result: ${pass ? 'PASS' : 'FAIL'}`);

  process.exitCode = pass ? 0 : 1;
}

run();
