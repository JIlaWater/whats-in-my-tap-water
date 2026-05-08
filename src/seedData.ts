import type {
  AustralianSuburb,
  LocationAuthorityMapping,
  SourceFreshness,
  SuburbWaterReport,
  SupplyZone,
  WaterAuthority,
} from './dataModels';

const SAMPLE = 'SAMPLE_PLACEHOLDER' as const;

export const suburbs: AustralianSuburb[] = [
  { id: 'au-qld-south-brisbane-4101', suburb: 'South Brisbane', state: 'QLD', postcode: '4101', lga: 'Brisbane City', region: 'Brisbane', dataLabel: SAMPLE },
  { id: 'au-qld-west-end-4101', suburb: 'West End', state: 'QLD', postcode: '4101', lga: 'Brisbane City', region: 'Brisbane', dataLabel: SAMPLE },
  { id: 'au-qld-new-farm-4005', suburb: 'New Farm', state: 'QLD', postcode: '4005', lga: 'Brisbane City', region: 'Brisbane', dataLabel: SAMPLE },
  { id: 'au-qld-chermside-4032', suburb: 'Chermside', state: 'QLD', postcode: '4032', lga: 'Brisbane City', region: 'Brisbane', dataLabel: SAMPLE },
  { id: 'au-qld-indooroopilly-4068', suburb: 'Indooroopilly', state: 'QLD', postcode: '4068', lga: 'Brisbane City', region: 'Brisbane', dataLabel: SAMPLE },
  { id: 'au-qld-carindale-4152', suburb: 'Carindale', state: 'QLD', postcode: '4152', lga: 'Brisbane City', region: 'Brisbane', dataLabel: SAMPLE },
  { id: 'au-qld-ashgrove-4060', suburb: 'Ashgrove', state: 'QLD', postcode: '4060', lga: 'Brisbane City', region: 'Brisbane', dataLabel: SAMPLE },
  { id: 'au-qld-mount-gravatt-4122', suburb: 'Mount Gravatt', state: 'QLD', postcode: '4122', lga: 'Brisbane City', region: 'Brisbane', dataLabel: SAMPLE },
  { id: 'au-qld-sunnybank-4109', suburb: 'Sunnybank', state: 'QLD', postcode: '4109', lga: 'Brisbane City', region: 'Brisbane', dataLabel: SAMPLE },
  { id: 'au-qld-manly-west-4179', suburb: 'Manly West', state: 'QLD', postcode: '4179', lga: 'Brisbane City', region: 'Brisbane', dataLabel: SAMPLE },
  { id: 'au-qld-ipswich-4305', suburb: 'Ipswich', state: 'QLD', postcode: '4305', lga: 'Ipswich City', region: 'SEQ', dataLabel: SAMPLE },
  { id: 'au-qld-springfield-lakes-4300', suburb: 'Springfield Lakes', state: 'QLD', postcode: '4300', lga: 'Ipswich City', region: 'SEQ', dataLabel: SAMPLE },
  { id: 'au-qld-logan-central-4114', suburb: 'Logan Central', state: 'QLD', postcode: '4114', lga: 'Logan City', region: 'SEQ', dataLabel: SAMPLE },
  { id: 'au-qld-shailer-park-4128', suburb: 'Shailer Park', state: 'QLD', postcode: '4128', lga: 'Logan City', region: 'SEQ', dataLabel: SAMPLE },
  { id: 'au-qld-cleveland-4163', suburb: 'Cleveland', state: 'QLD', postcode: '4163', lga: 'Redland City', region: 'SEQ', dataLabel: SAMPLE },
  { id: 'au-qld-capalaba-4157', suburb: 'Capalaba', state: 'QLD', postcode: '4157', lga: 'Redland City', region: 'SEQ', dataLabel: SAMPLE },
  { id: 'au-qld-redcliffe-4020', suburb: 'Redcliffe', state: 'QLD', postcode: '4020', lga: 'Moreton Bay', region: 'SEQ', dataLabel: SAMPLE },
  { id: 'au-qld-north-lakes-4509', suburb: 'North Lakes', state: 'QLD', postcode: '4509', lga: 'Moreton Bay', region: 'SEQ', dataLabel: SAMPLE },
  { id: 'au-qld-maroochydore-4558', suburb: 'Maroochydore', state: 'QLD', postcode: '4558', lga: 'Sunshine Coast', region: 'SEQ', dataLabel: SAMPLE },
  { id: 'au-qld-caloundra-4551', suburb: 'Caloundra', state: 'QLD', postcode: '4551', lga: 'Sunshine Coast', region: 'SEQ', dataLabel: SAMPLE },
  { id: 'au-qld-toowoomba-4350', suburb: 'Toowoomba', state: 'QLD', postcode: '4350', lga: 'Toowoomba Region', region: 'Regional', dataLabel: SAMPLE },
];

export const authorities: WaterAuthority[] = [
  { id: 'urban-utilities', name: 'Urban Utilities', serviceArea: 'Brisbane / Ipswich / Lockyer Valley', plannedSourceIntegration: ['Urban Utilities annual reports', 'Seqwater treatment data'], dataLabel: SAMPLE },
  { id: 'unitywater', name: 'Unitywater', serviceArea: 'Moreton Bay / Sunshine Coast / Noosa', plannedSourceIntegration: ['Unitywater quality reports', 'Seqwater source summaries'], dataLabel: SAMPLE },
  { id: 'logan-water', name: 'Logan Water', serviceArea: 'Logan / Scenic Rim / Redland selected supply interfaces', plannedSourceIntegration: ['Logan City water reports', 'Seqwater catchment updates'], dataLabel: SAMPLE },
];

export const supplyZones: SupplyZone[] = [
  { id: 'zone-brisbane-inner', authorityId: 'urban-utilities', code: 'UU-BNE-INNER', displayName: 'Brisbane Inner Grid', description: 'Placeholder zone for inner Brisbane suburbs.', dataLabel: SAMPLE },
  { id: 'zone-brisbane-south', authorityId: 'urban-utilities', code: 'UU-BNE-SOUTH', displayName: 'Brisbane South Grid', description: 'Placeholder zone for Brisbane southern suburbs.', dataLabel: SAMPLE },
  { id: 'zone-ipswich-corridor', authorityId: 'urban-utilities', code: 'UU-IPS-COR', displayName: 'Ipswich Corridor', description: 'Placeholder zone for Ipswich and Springfield corridor.', dataLabel: SAMPLE },
  { id: 'zone-logan-redlands', authorityId: 'logan-water', code: 'LW-LOG-RED', displayName: 'Logan & Redlands Interface', description: 'Placeholder mapped area for Logan/Redlands.', dataLabel: SAMPLE },
  { id: 'zone-bay-coast', authorityId: 'unitywater', code: 'UW-BAY-CST', displayName: 'Bay & Coast Zone', description: 'Placeholder zone for Moreton Bay and Sunshine Coast.', dataLabel: SAMPLE },
];

export const suburbMappings: LocationAuthorityMapping[] = suburbs.map((suburb) => {
  const byLga = suburb.lga;
  let authorityId = 'urban-utilities';
  let supplyZoneId = 'zone-brisbane-inner';

  if (byLga.includes('Logan') || byLga.includes('Redland')) {
    authorityId = 'logan-water';
    supplyZoneId = 'zone-logan-redlands';
  } else if (byLga.includes('Moreton Bay') || byLga.includes('Sunshine Coast')) {
    authorityId = 'unitywater';
    supplyZoneId = 'zone-bay-coast';
  } else if (byLga.includes('Ipswich')) {
    authorityId = 'urban-utilities';
    supplyZoneId = 'zone-ipswich-corridor';
  } else if (suburb.suburb === 'Sunnybank' || suburb.suburb === 'Mount Gravatt' || suburb.suburb === 'Carindale') {
    supplyZoneId = 'zone-brisbane-south';
  }

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
