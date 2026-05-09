export type CoverageStatus =
  | 'reviewed_source_backed'
  | 'sample_placeholder'
  | 'needs_source'
  | 'candidate_imported'
  | 'needs_qa';

export type SeqCoverageEntry = {
  suburb: string;
  postcode: string;
  state: 'QLD';
  region: string;
  displayRegionName: string;
  sourceRegionKey?: string;
  waterAuthority: 'Urban Utilities' | 'Unitywater' | 'Seqwater';
  dataStatus: CoverageStatus;
  statusLabel: string;
};

const reviewedRegions = new Set(['brisbane', 'moreton']);
const candidateRegions = new Set(['gold-coast', 'logan', 'redland', 'scenic-rim', 'somerset']);

const mk = (suburb: string, postcode: string, region: string, waterAuthority: SeqCoverageEntry['waterAuthority']): SeqCoverageEntry => {
  const key = region.toLowerCase().replace(/\s+/g, '-');
  const reviewed = reviewedRegions.has(key);
  const candidate = candidateRegions.has(key);
  return {
    suburb,
    postcode,
    state: 'QLD',
    region,
    displayRegionName: region,
    waterAuthority,
    sourceRegionKey: reviewed ? key : undefined,
    dataStatus: reviewed ? 'reviewed_source_backed' : candidate ? 'candidate_imported' : 'sample_placeholder',
    statusLabel: reviewed ? 'Reviewed source-backed data' : candidate ? `${region} source data is being reviewed and is not displayed yet.` : 'Sample placeholder shown where reviewed data is not available.',
  };
};

export const seqCoverageMap: SeqCoverageEntry[] = [
  mk('South Brisbane', '4101', 'Brisbane', 'Urban Utilities'), mk('West End', '4101', 'Brisbane', 'Urban Utilities'), mk('New Farm', '4005', 'Brisbane', 'Urban Utilities'), mk('Paddington', '4064', 'Brisbane', 'Urban Utilities'), mk('Carindale', '4152', 'Brisbane', 'Urban Utilities'), mk('Indooroopilly', '4068', 'Brisbane', 'Urban Utilities'), mk('Chermside', '4032', 'Brisbane', 'Urban Utilities'), mk('Rocklea', '4106', 'Brisbane', 'Urban Utilities'),
  mk('North Lakes', '4509', 'Moreton', 'Unitywater'), mk('Redcliffe', '4020', 'Moreton', 'Unitywater'), mk('Kippa-Ring', '4021', 'Moreton', 'Unitywater'), mk('Caboolture', '4510', 'Moreton', 'Unitywater'), mk('Morayfield', '4506', 'Moreton', 'Unitywater'),
  mk('Southport', '4215', 'Gold Coast', 'Seqwater'), mk('Surfers Paradise', '4217', 'Gold Coast', 'Seqwater'), mk('Robina', '4226', 'Gold Coast', 'Seqwater'),
  mk('Loganholme', '4129', 'Logan', 'Urban Utilities'), mk('Springwood', '4127', 'Logan', 'Urban Utilities'), mk('Beenleigh', '4207', 'Logan', 'Urban Utilities'),
  mk('Cleveland', '4163', 'Redland', 'Urban Utilities'), mk('Capalaba', '4157', 'Redland', 'Urban Utilities'),
  mk('Beaudesert', '4285', 'Scenic Rim', 'Seqwater'), mk('Boonah', '4310', 'Scenic Rim', 'Seqwater'),
  mk('Kilcoy', '4515', 'Somerset', 'Seqwater'), mk('Esk', '4312', 'Somerset', 'Seqwater'),
  mk('Ipswich', '4305', 'Ipswich', 'Urban Utilities'), mk('Maroochydore', '4558', 'Sunshine Coast', 'Unitywater'), mk('Noosa Heads', '4567', 'Noosa', 'Unitywater'), mk('Toowoomba', '4350', 'Toowoomba', 'Seqwater'),
];

export const suggestedTestSuburbs = ['South Brisbane', 'North Lakes', 'Southport', 'Loganholme', 'Cleveland', 'Beaudesert', 'Kilcoy'];
