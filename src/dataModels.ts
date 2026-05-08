export type DataReviewStatus = 'sample' | 'imported' | 'reviewed' | 'publishable' | 'published';

export type DataLabel = DataReviewStatus;

export type AustralianSuburb = {
  id: string;
  suburb: string;
  state: 'QLD';
  postcode: string;
  lga: string;
  region: 'Brisbane' | 'SEQ' | 'Regional';
  dataLabel: DataLabel;
};

export type WaterAuthority = {
  id: string;
  name: string;
  serviceArea: string;
  plannedSourceIntegration: string[];
  dataLabel: DataLabel;
};

export type SupplyZone = {
  id: string;
  authorityId: string;
  code: string;
  displayName: string;
  description: string;
  dataLabel: DataLabel;
};

export type LocationAuthorityMapping = {
  suburbId: string;
  authorityId: string;
  supplyZoneId: string;
  mappingLabel: DataLabel;
};

export type WaterParameter = {
  key: 'hardness_mg_l' | 'free_chlorine_mg_l' | 'ph' | 'tds_mg_l';
  displayName: string;
  unit: string;
  placeholderValue: number;
  methodNote: string;
  dataLabel: DataLabel;
};

export type DataConfidence = {
  level: 'low' | 'medium' | 'high';
  scoreOutOf100: number;
  reason: string;
  dataLabel: DataLabel;
};

export type SourceFreshness = {
  sourceName: string;
  fetchedAt: string;
  expectedRefreshDays: number;
  staleness: 'fresh' | 'aging' | 'stale';
  dataLabel: DataLabel;
};

export type SuburbWaterReport = {
  suburbId: string;
  confidence: DataConfidence;
  sourceFreshness: SourceFreshness;
  parameters: WaterParameter[];
  notes: string[];
  dataLabel: DataLabel;
};
