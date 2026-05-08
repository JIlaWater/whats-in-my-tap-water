export type ReviewStatus = 'sample' | 'imported' | 'reviewed' | 'publishable' | 'published';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type CoverageLevel = 'suburb' | 'postcode' | 'supply_zone' | 'authority' | 'council' | 'state';

export type SourceReferenceRecord = {
  sourceReferenceId: string;
  sourceName: string;
  authorityId: string;
  sourceUrl: string;
  documentTitle: string;
  publicationDate: string;
  lastCheckedDate: string;
  confidenceLevel: ConfidenceLevel;
  coverageLevel: CoverageLevel;
  councilName?: string;
  state: string;
  reviewStatus: ReviewStatus;
  notes?: string;
};

export type ImportValidationIssue = {
  rowNumber: number;
  field: string;
  message: string;
};
