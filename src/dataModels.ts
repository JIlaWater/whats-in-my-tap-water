export type Confidence = 'High' | 'Medium' | 'Low' | 'Unknown';
export type Coverage = 'Exact suburb' | 'Postcode' | 'Supply zone' | 'Water authority' | 'Council area' | 'Regional' | 'State guidance' | 'Unknown';
export type Freshness = 'Live' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | 'Static guidance' | 'Unknown';
export type ReviewStatus = 'Reviewed' | 'Region-backed' | 'Being reviewed' | 'Requested' | 'Unknown';
export type WatchLevel = 'Low' | 'Medium' | 'High' | 'Property dependent' | 'Under review';

export type WaterSource = {
  title: string; url?: string; sourceType: 'pdf_report' | 'guideline' | 'regional_dataset' | 'under_review'; humanLabel: string;
  publisher: string; publicationDate?: string; lastChecked: string; coverageLevel: Coverage; confidence: Confidence; notes?: string;
};
export type ValueWithMeta = {
  label: string; value?: string; unit?: string; isExactValue: boolean; source: WaterSource; confidence: Confidence; coverageLevel: Coverage;
};

export type WatchItem = { label: string; level: WatchLevel; note: string };

export type LocationProfile = {
  id: string; suburb: string; postcode: string; state: 'QLD'; region: string; slug: string; aliases: string[];
  providerName: string; waterAuthority: string; waterSourceContext: string; supplyContext: string; treatmentContext: string; disinfectantContext: string;
  hardnessCategory: string; scaleRiskCategory: WatchLevel; tasteOdourCategory: WatchLevel;
  householdComfortWatchlist: WatchItem[]; whatLocalsMayNotice: string[]; whatToTestAtHome: string[]; recommendedFiltrationPathways: string[];
  confidence: Confidence; coverageLevel: Coverage; freshness: Freshness; reviewStatus: ReviewStatus; lastChecked: string;
  sources: WaterSource[]; jilaEligible: boolean; seoIndexable: boolean;
  shareSummary: string; socialPost: string;
};

export type SearchResult = {
  query: string; status: 'empty' | 'single' | 'multiple' | 'unknown'; matchedType: 'suburb' | 'postcode' | 'alias' | 'partial' | 'fuzzy' | 'none';
  profiles: LocationProfile[]; suggestions: string[];
};
export type AustralianSuburb = { id: string; suburb: string; state: 'QLD'; postcode: string; lga: string; region: 'Brisbane' | 'SEQ' | 'Regional'; dataLabel: string };
export type LocationAuthorityMapping = { suburbId: string; authorityId: string; supplyZoneId: string; mappingLabel: string };
