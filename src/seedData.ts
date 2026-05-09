import { seqCoverageMap } from './coverageMap';
import type {
  AustralianSuburb,
  LocationAuthorityMapping,
  SourceFreshness,
  SuburbWaterReport,
  SupplyZone,
  WaterAuthority,
} from './dataModels';

const SAMPLE = 'sample' as const;

export const suburbs: AustralianSuburb[] = seqCoverageMap.map((entry) => ({
  id: `au-qld-${entry.suburb.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${entry.postcode}`,
  suburb: entry.suburb,
  state: 'QLD',
  postcode: entry.postcode,
  lga: `${entry.region} Region`,
  region: entry.region === 'Brisbane' ? 'Brisbane' : entry.region === 'Toowoomba' ? 'Regional' : 'SEQ',
  dataLabel: SAMPLE,
}));

export const authorities: WaterAuthority[] = [
  { id: 'urban-utilities', name: 'Urban Utilities', serviceArea: 'Brisbane / Ipswich / Lockyer Valley', plannedSourceIntegration: ['Urban Utilities annual reports', 'Seqwater treatment data'], dataLabel: SAMPLE },
  { id: 'unitywater', name: 'Unitywater', serviceArea: 'Moreton Bay / Sunshine Coast / Noosa', plannedSourceIntegration: ['Unitywater quality reports', 'Seqwater source summaries'], dataLabel: SAMPLE },
  { id: 'seqwater', name: 'Seqwater', serviceArea: 'South East Queensland bulk water supply', plannedSourceIntegration: ['Seqwater source water updates', 'Seqwater annual water quality data'], dataLabel: SAMPLE },
];

export const supplyZones: SupplyZone[] = [
  { id: 'zone-brisbane-inner', authorityId: 'urban-utilities', code: 'UU-BNE-INNER', displayName: 'Brisbane Inner Grid', description: 'Placeholder zone for inner Brisbane suburbs.', dataLabel: SAMPLE },
  { id: 'zone-brisbane-south', authorityId: 'urban-utilities', code: 'UU-BNE-SOUTH', displayName: 'Brisbane South Grid', description: 'Placeholder zone for Brisbane southern suburbs.', dataLabel: SAMPLE },
  { id: 'zone-ipswich-corridor', authorityId: 'urban-utilities', code: 'UU-IPS-COR', displayName: 'Ipswich Corridor', description: 'Placeholder zone for Ipswich and Springfield corridor.', dataLabel: SAMPLE },
  { id: 'zone-logan-redlands', authorityId: 'urban-utilities', code: 'UU-LOG-RED', displayName: 'Logan & Redlands Interface', description: 'Placeholder mapped area for Logan/Redlands via SEQ network.', dataLabel: SAMPLE },
  { id: 'zone-bay-coast', authorityId: 'unitywater', code: 'UW-BAY-CST', displayName: 'Bay & Coast Zone', description: 'Placeholder zone for Moreton Bay and Sunshine Coast.', dataLabel: SAMPLE },
];

export const suburbMappings: LocationAuthorityMapping[] = suburbs.map((suburb) => {
  const coverage = seqCoverageMap.find((entry) => entry.suburb === suburb.suburb && entry.postcode === suburb.postcode);
  const authorityId = coverage?.waterAuthority === 'Unitywater'
    ? 'unitywater'
    : coverage?.waterAuthority === 'Seqwater'
      ? 'seqwater'
      : 'urban-utilities';

  const supplyZoneId = authorityId === 'unitywater'
    ? 'zone-bay-coast'
    : suburb.region === 'Brisbane'
      ? 'zone-brisbane-inner'
      : 'zone-logan-redlands';

  return { suburbId: suburb.id, authorityId, supplyZoneId, mappingLabel: SAMPLE };
});


const commonFreshness: SourceFreshness = {
  sourceName: 'Sample placeholder ETL batch',
  fetchedAt: '2026-05-01T00:00:00Z',
  expectedRefreshDays: 30,
  staleness: 'aging',
  dataLabel: SAMPLE,
};

export const reports: SuburbWaterReport[] = suburbs.map((suburb, index) => ({
  suburbId: suburb.id,
  confidence: {
    level: 'low',
    scoreOutOf100: 35 + (index % 10),
    reason: 'Placeholder-only values pending live authority ingestion.',
    dataLabel: SAMPLE,
  },
  sourceFreshness: commonFreshness,
  parameters: [
    { key: 'hardness_mg_l', displayName: 'Hardness', unit: 'mg/L', placeholderValue: 45 + (index % 12), methodNote: 'Sample generated value.', dataLabel: SAMPLE },
    { key: 'free_chlorine_mg_l', displayName: 'Free Chlorine', unit: 'mg/L', placeholderValue: Number((0.45 + (index % 8) * 0.03).toFixed(2)), methodNote: 'Sample generated value.', dataLabel: SAMPLE },
    { key: 'ph', displayName: 'pH', unit: 'pH', placeholderValue: Number((7.1 + (index % 5) * 0.1).toFixed(1)), methodNote: 'Sample generated value.', dataLabel: SAMPLE },
    { key: 'tds_mg_l', displayName: 'Total Dissolved Solids (TDS)', unit: 'mg/L', placeholderValue: 120 + index * 2, methodNote: 'Sample generated value.', dataLabel: SAMPLE },
  ],
  notes: ['SAMPLE / PLACEHOLDER DATA ONLY.', 'Not live water quality data.', 'No health guidance provided.'],
  dataLabel: SAMPLE,
}));
