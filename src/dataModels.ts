export type ProfileType = 'suburb_specific' | 'regional_guidance' | 'fallback_guidance';

export type SearchIndexEntry = {
  suburb: string;
  postcode: string;
  state: 'QLD';
  lga: string;
  regionGroup: string;
  aliases: string[];
  matchedProfileSlug: string;
  profileType: ProfileType;
  jilaEligible: boolean;
  searchPriority: number;
};

export type WaterProfile = {
  slug: string;
  profileName: string;
  profileType: ProfileType;
  regionLabel: string;
  headline: string;
  summary: string;
  supplyContext: string;
  commonConcerns: string[];
  likelyNoticeableIssues: string[];
  householdFactors: string[];
  recommendedTesting: string[];
  jilaRecommendation: string;
  ctaTitle: string;
  ctaCopy: string;
  shareHeadlineTemplate: string;
  shareTextTemplate: string;
  disclaimer: string;
  sourceNotes: string[];
  confidenceLabel: 'High' | 'Medium';
  coverageLabel: 'Suburb + regional context' | 'Regional supply context' | 'SEQ-wide guidance';
  freshnessLabel: string;
};

export type MatchResult =
  | { type: 'single'; entry: SearchIndexEntry }
  | { type: 'postcode_multiple'; postcode: string; entries: SearchIndexEntry[] }
  | { type: 'unknown'; suggestions: SearchIndexEntry[] };

// Legacy exports retained for compatibility with existing scripts/modules.
export type Confidence = 'High' | 'Medium' | 'Low' | 'Unknown';
export type Coverage = 'Exact suburb' | 'Postcode' | 'Supply zone' | 'Water authority' | 'Council area' | 'Regional' | 'State guidance' | 'Unknown';
export type Freshness = 'Live' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | 'Static guidance' | 'Unknown';
export type ReviewStatus = 'Reviewed' | 'Region-backed' | 'Being reviewed' | 'Requested' | 'Unknown';
export type WatchLevel = 'Low' | 'Medium' | 'High' | 'Property dependent' | 'Under review';
export type WaterSource = { title: string; url?: string; sourceType: 'pdf_report' | 'guideline' | 'regional_dataset' | 'under_review'; humanLabel: string; publisher: string; publicationDate?: string; lastChecked: string; coverageLevel: Coverage; confidence: Confidence; notes?: string; };
export type ValueWithMeta = { label: string; value?: string; unit?: string; isExactValue: boolean; source: WaterSource; confidence: Confidence; coverageLevel: Coverage; };
export type WatchItem = { label: string; level: WatchLevel; note: string };
export type LocationProfile = { id: string; suburb: string; postcode: string; state: 'QLD'; region: string; slug: string; aliases: string[]; providerName: string; waterAuthority: string; waterSourceContext: string; supplyContext: string; treatmentContext: string; disinfectantContext: string; hardnessCategory: string; scaleRiskCategory: WatchLevel; tasteOdourCategory: WatchLevel; householdComfortWatchlist: WatchItem[]; whatLocalsMayNotice: string[]; whatToTestAtHome: string[]; recommendedFiltrationPathways: string[]; confidence: Confidence; coverageLevel: Coverage; freshness: Freshness; reviewStatus: ReviewStatus; lastChecked: string; sources: WaterSource[]; jilaEligible: boolean; seoIndexable: boolean; shareSummary: string; socialPost: string; };
export type AustralianSuburb = { id: string; suburb: string; state: 'QLD'; postcode: string; lga: string; region: 'Brisbane' | 'SEQ' | 'Regional'; dataLabel: string };
export type LocationAuthorityMapping = { suburbId: string; authorityId: string; supplyZoneId: string; mappingLabel: string };
