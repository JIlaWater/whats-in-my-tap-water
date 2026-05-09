export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Unknown';
export type CoverageLevel = 'Exact suburb' | 'Postcode' | 'Supply zone' | 'Water authority' | 'Council area' | 'Regional estimate' | 'State guidance' | 'Unknown';
export type FreshnessLabel = 'Live / Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | 'Static / Guideline' | 'Unknown';
export type DataReviewStatus = 'sample' | 'imported' | 'reviewed' | 'publishable' | 'published';
export type DataLabel = DataReviewStatus;
export type AustralianSuburb = { id: string; suburb: string; state: 'QLD'; postcode: string; lga: string; region: 'Brisbane' | 'SEQ' | 'Regional'; dataLabel: DataLabel };
export type LocationAuthorityMapping = { suburbId: string; authorityId: string; supplyZoneId: string; mappingLabel: DataLabel };

export type DataSource = { id: string; sourceName: string; sourceUrl: string; sourceType: 'pdf_report' | 'official_web_page' | 'guideline' | 'unknown'; publicationDate: string; lastCheckedDate: string; coverageLevel: CoverageLevel; freshnessLabel: FreshnessLabel; confidence: ConfidenceLevel };
export type WaterParameter = { parameterName: string; displayLabel: string; value?: string; unit?: string; sourceId: string; confidence: ConfidenceLevel; plainEnglishMeaning: string; householdRelevance: string; caveat?: string };
export type Region = { name: string; slug: string; providerGuess: string; waterSourceType: string; commonHouseholdConcerns: string[]; explanation: string; recommendation: string; recommendedSystem: string; confidence: ConfidenceLevel; coverage: CoverageLevel; sourceIds: string[]; disclaimer: string; isSeqld: boolean };
export type Suburb = { id: string; suburb: string; postcode: string; state: 'QLD'; regionSlug: string };
export type Postcode = { postcode: string; suburbIds: string[] };
export type ReportRecommendation = { nextSteps: string[]; ctaLabel?: string; ctaUrl?: string };
export type WaterReportProfile = { id: string; regionSlug: string; profileName: string; confidence: ConfidenceLevel; coverage: CoverageLevel; freshness: FreshnessLabel; lastCheckedDate: string; sourceIds: string[]; summary: string; likelySymptoms: string[]; parameters: WaterParameter[]; recommendation: ReportRecommendation; methodology: string };
export type LeadPayload = { first_name: string; email: string; phone?: string; suburb: string; postcode: string; water_source_type: string; main_concern: string; region_name: string; region_slug: string; report_profile: string; provider_guess: string; recommended_system: string; report_url: string; utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; gclid?: string; fbclid?: string; timestamp: string };
