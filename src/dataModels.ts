export type Confidence = 'High' | 'Medium' | 'Low' | 'Unknown';
export type Coverage = 'Exact suburb' | 'Postcode' | 'Supply zone' | 'Water authority' | 'Council area' | 'Regional' | 'State guidance' | 'Unknown';
export type Freshness = 'Live' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | 'Static guidance' | 'Unknown';
export type ReviewStatus = 'Reviewed' | 'Region-backed' | 'Being reviewed' | 'Requested' | 'Unknown';

export type WaterSource = {
  title: string; url?: string; sourceType: 'pdf_report' | 'guideline' | 'regional_dataset' | 'under_review'; humanLabel: string;
  publisher: string; publicationDate?: string; lastChecked: string; coverageLevel: Coverage; confidence: Confidence; notes?: string;
};

export type ValueWithMeta = {
  label: string; value?: string; unit?: string; isExactValue: boolean; source: WaterSource; confidence: Confidence; coverageLevel: Coverage;
};

export type LocationProfile = {
  id: string; suburb: string; postcode: string; state: 'QLD'; region: string; slug: string; aliases: string[];
  providerName: string; waterAuthority: string; waterSourceContext: string; supplyContext: string; treatmentContext: string; disinfectantContext: string;
  hardnessCategory: string; scaleRiskCategory: string; tasteOdourCategory: string; skinHairComfortCategory: string; applianceProtectionCategory: string; sedimentRustCategory: string;
  householdComfortWatchlist: string[]; whatToTestAtHome: string[]; recommendedFiltrationPathways: string[]; commonLocalConcerns: string[];
  confidence: Confidence; coverageLevel: Coverage; freshness: Freshness; reviewStatus: ReviewStatus; lastChecked: string;
  exactValues?: ValueWithMeta[];
  sources: WaterSource[]; jilaEligible: boolean; seoIndexable: boolean;
};

export type SearchResult = { query: string; matchedType: 'suburb' | 'postcode' | 'alias' | 'none'; matchedLocation?: LocationProfile; confidence: Confidence; suggestions: string[]; fallbackReason?: string };

export type AustralianSuburb = { id: string; suburb: string; state: 'QLD'; postcode: string; lga: string; region: 'Brisbane' | 'SEQ' | 'Regional'; dataLabel: string };
export type LocationAuthorityMapping = { suburbId: string; authorityId: string; supplyZoneId: string; mappingLabel: string };
