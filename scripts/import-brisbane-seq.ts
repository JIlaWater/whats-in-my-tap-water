import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { parseCsv, validateSourceReferenceRecord, validateWaterQualityParameterRow } from '../src/dataImport/csvImport';
import type { ImportValidationIssue } from '../src/dataImport/types';

type FileValidationReport = {
  fileName: string;
  rowCount: number;
  validRowCount: number;
  invalidRowCount: number;
  issues: ImportValidationIssue[];
};

type StagingArtifact = {
  generatedAt: string;
  importTarget: 'brisbane-seq';
  dryRun: true;
  publishBlocked: true;
  sourceMode: 'offline-template-csv-only';
  report: {
    files: FileValidationReport[];
    totalRows: number;
    totalValidRows: number;
    totalInvalidRows: number;
    hasErrors: boolean;
  };
  records: Array<{
    fileName: string;
    rowNumber: number;
    data: Record<string, string>;
    importFlags: {
      reviewStatus: 'sample' | 'imported';
      needsHumanReview: true;
      publishBlocked: true;
    };
  }>;
};

const templateDir = join(process.cwd(), 'data', 'templates');
const stagingPath = join(process.cwd(), 'data', 'staging', 'brisbane-seq-import.preview.json');

const csvFiles = [
  'source_freshness_cadence.csv',
  'source_references.csv',
  'suburbs_postcodes.csv',
  'supply_zones.csv',
  'water_authorities.csv',
  'water_quality_parameters.csv',
] as const;

const normalizeReviewStatus = (value: string): 'sample' | 'imported' => (value === 'sample' ? 'sample' : 'imported');

const validateRow = (fileName: string, row: Record<string, string>, rowNumber: number): ImportValidationIssue[] => {
  if (fileName === 'source_references.csv') {
    return validateSourceReferenceRecord(
      {
        sourceUrl: row.source_url,
        publicationDate: row.publication_date,
        lastCheckedDate: row.last_checked_date,
        confidenceLevel: row.confidence_level as 'low' | 'medium' | 'high',
        coverageLevel: row.coverage_level as 'suburb' | 'postcode' | 'supply_zone' | 'authority' | 'council' | 'state',
        reviewStatus: row.review_status as 'sample' | 'imported' | 'reviewed' | 'publishable' | 'published',
      },
      rowNumber,
    );
  }

  return validateWaterQualityParameterRow(row, rowNumber);
};

const main = async () => {
  const artifact: StagingArtifact = {
    generatedAt: new Date().toISOString(),
    importTarget: 'brisbane-seq',
    dryRun: true,
    publishBlocked: true,
    sourceMode: 'offline-template-csv-only',
    report: {
      files: [],
      totalRows: 0,
      totalValidRows: 0,
      totalInvalidRows: 0,
      hasErrors: false,
    },
    records: [],
  };

  for (const fileName of csvFiles) {
    const raw = await readFile(join(templateDir, fileName), 'utf-8');
    const rows = parseCsv(raw);
    const fileReport: FileValidationReport = {
      fileName,
      rowCount: rows.length,
      validRowCount: 0,
      invalidRowCount: 0,
      issues: [],
    };

    rows.forEach((row, index) => {
      const rowNumber = index + 2;
      const issues = validateRow(fileName, row, rowNumber);

      if (issues.length > 0) {
        fileReport.invalidRowCount += 1;
        fileReport.issues.push(...issues);
      } else {
        fileReport.validRowCount += 1;
      }

      artifact.records.push({
        fileName,
        rowNumber,
        data: {
          ...row,
          review_status: normalizeReviewStatus(row.review_status),
        },
        importFlags: {
          reviewStatus: normalizeReviewStatus(row.review_status),
          needsHumanReview: true,
          publishBlocked: true,
        },
      });
    });

    artifact.report.files.push(fileReport);
  }

  artifact.report.totalRows = artifact.report.files.reduce((sum, file) => sum + file.rowCount, 0);
  artifact.report.totalValidRows = artifact.report.files.reduce((sum, file) => sum + file.validRowCount, 0);
  artifact.report.totalInvalidRows = artifact.report.files.reduce((sum, file) => sum + file.invalidRowCount, 0);
  artifact.report.hasErrors = artifact.report.totalInvalidRows > 0;

  await mkdir(join(process.cwd(), 'data', 'staging'), { recursive: true });
  await writeFile(stagingPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf-8');

  if (artifact.report.hasErrors) {
    throw new Error(`Validation failed. See staging report: ${stagingPath}`);
  }

  console.log(`Import preview written to ${stagingPath}`);
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown import error';
  console.error(`Brisbane/SEQ import preview failed safely: ${message}`);
  process.exitCode = 1;
});
