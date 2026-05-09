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
  noResultFallbackLabel: string;
  suggestedSuburbs?: string[];
};

const reviewedRegions = new Set(['brisbane', 'moreton']);
const candidateRegions = new Set(['gold-coast', 'logan', 'redland', 'scenic-rim', 'somerset']);

const mk = (suburb: string, postcode: string, region: string, waterAuthority: SeqCoverageEntry['waterAuthority']): SeqCoverageEntry => {
  const key = region.toLowerCase().replace(/\s+/g, '-');
  const reviewed = reviewedRegions.has(key);
  const candidate = candidateRegions.has(key);
  return {
    suburb, postcode, state: 'QLD', region, displayRegionName: region, waterAuthority,
    sourceRegionKey: reviewed ? key : undefined,
    dataStatus: reviewed ? 'reviewed_source_backed' : candidate ? 'candidate_imported' : 'sample_placeholder',
    statusLabel: reviewed ? 'Reviewed source-backed data' : candidate ? `${region} source data is being reviewed and is not displayed yet.` : 'Sample placeholder shown where reviewed data is not available.',
    noResultFallbackLabel: 'We don’t have that suburb in the beta dataset yet.',
  };
};

export const seqCoverageMap: SeqCoverageEntry[] = [
  // Brisbane
  mk('South Brisbane', '4101', 'Brisbane', 'Urban Utilities'), mk('West End', '4101', 'Brisbane', 'Urban Utilities'), mk('New Farm', '4005', 'Brisbane', 'Urban Utilities'), mk('Paddington', '4064', 'Brisbane', 'Urban Utilities'), mk('Carindale', '4152', 'Brisbane', 'Urban Utilities'), mk('Indooroopilly', '4068', 'Brisbane', 'Urban Utilities'), mk('Chermside', '4032', 'Brisbane', 'Urban Utilities'), mk('Rocklea', '4106', 'Brisbane', 'Urban Utilities'), mk('Coorparoo', '4151', 'Brisbane', 'Urban Utilities'), mk('Bulimba', '4171', 'Brisbane', 'Urban Utilities'), mk('Hamilton', '4007', 'Brisbane', 'Urban Utilities'), mk('Ashgrove', '4060', 'Brisbane', 'Urban Utilities'), mk('The Gap', '4061', 'Brisbane', 'Urban Utilities'), mk('Toowong', '4066', 'Brisbane', 'Urban Utilities'), mk('Morningside', '4170', 'Brisbane', 'Urban Utilities'), mk('Mount Gravatt', '4122', 'Brisbane', 'Urban Utilities'),
  // Moreton
  mk('North Lakes', '4509', 'Moreton', 'Unitywater'), mk('Redcliffe', '4020', 'Moreton', 'Unitywater'), mk('Kippa-Ring', '4021', 'Moreton', 'Unitywater'), mk('Caboolture', '4510', 'Moreton', 'Unitywater'), mk('Morayfield', '4506', 'Moreton', 'Unitywater'), mk('Burpengary', '4505', 'Moreton', 'Unitywater'), mk('Strathpine', '4500', 'Moreton', 'Unitywater'), mk('Samford', '4520', 'Moreton', 'Unitywater'), mk('Bongaree', '4507', 'Moreton', 'Unitywater'), mk('Deception Bay', '4508', 'Moreton', 'Unitywater'),
  // Gold Coast
  mk('Southport', '4215', 'Gold Coast', 'Seqwater'), mk('Surfers Paradise', '4217', 'Gold Coast', 'Seqwater'), mk('Broadbeach', '4218', 'Gold Coast', 'Seqwater'), mk('Burleigh Heads', '4220', 'Gold Coast', 'Seqwater'), mk('Robina', '4226', 'Gold Coast', 'Seqwater'), mk('Varsity Lakes', '4227', 'Gold Coast', 'Seqwater'), mk('Helensvale', '4212', 'Gold Coast', 'Seqwater'), mk('Coomera', '4209', 'Gold Coast', 'Seqwater'), mk('Pimpama', '4209', 'Gold Coast', 'Seqwater'), mk('Nerang', '4211', 'Gold Coast', 'Seqwater'), mk('Palm Beach', '4221', 'Gold Coast', 'Seqwater'), mk('Coolangatta', '4225', 'Gold Coast', 'Seqwater'),
  // Logan
  mk('Loganholme', '4129', 'Logan', 'Urban Utilities'), mk('Loganlea', '4131', 'Logan', 'Urban Utilities'), mk('Beenleigh', '4207', 'Logan', 'Urban Utilities'), mk('Springwood', '4127', 'Logan', 'Urban Utilities'), mk('Browns Plains', '4118', 'Logan', 'Urban Utilities'), mk('Shailer Park', '4128', 'Logan', 'Urban Utilities'), mk('Daisy Hill', '4127', 'Logan', 'Urban Utilities'), mk('Marsden', '4132', 'Logan', 'Urban Utilities'), mk('Jimboomba', '4280', 'Logan', 'Urban Utilities'), mk('Yarrabilba', '4207', 'Logan', 'Urban Utilities'),
  // Redland
  mk('Cleveland', '4163', 'Redland', 'Urban Utilities'), mk('Capalaba', '4157', 'Redland', 'Urban Utilities'), mk('Victoria Point', '4165', 'Redland', 'Urban Utilities'), mk('Wellington Point', '4160', 'Redland', 'Urban Utilities'), mk('Redland Bay', '4165', 'Redland', 'Urban Utilities'), mk('Thornlands', '4164', 'Redland', 'Urban Utilities'), mk('Birkdale', '4159', 'Redland', 'Urban Utilities'), mk('Alexandra Hills', '4161', 'Redland', 'Urban Utilities'), mk('Raby Bay', '4163', 'Redland', 'Urban Utilities'), mk('Mount Cotton', '4165', 'Redland', 'Urban Utilities'),
  // Scenic Rim
  mk('Beaudesert', '4285', 'Scenic Rim', 'Seqwater'), mk('Boonah', '4310', 'Scenic Rim', 'Seqwater'), mk('Kalbar', '4309', 'Scenic Rim', 'Seqwater'), mk('Tamborine Mountain', '4272', 'Scenic Rim', 'Seqwater'), mk('Canungra', '4275', 'Scenic Rim', 'Seqwater'), mk('Rathdowney', '4287', 'Scenic Rim', 'Seqwater'),
  // Somerset
  mk('Kilcoy', '4515', 'Somerset', 'Seqwater'), mk('Esk', '4312', 'Somerset', 'Seqwater'), mk('Fernvale', '4306', 'Somerset', 'Seqwater'), mk('Lowood', '4311', 'Somerset', 'Seqwater'), mk('Toogoolawah', '4313', 'Somerset', 'Seqwater'),
  // Placeholder-safe extras
  mk('Ipswich', '4305', 'Ipswich', 'Urban Utilities'), mk('Springfield Lakes', '4300', 'Ipswich', 'Urban Utilities'), mk('Ripley', '4306', 'Ipswich', 'Urban Utilities'), mk('Redbank Plains', '4301', 'Ipswich', 'Urban Utilities'), mk('Brassall', '4305', 'Ipswich', 'Urban Utilities'), mk('Goodna', '4300', 'Ipswich', 'Urban Utilities'), mk('Yamanto', '4305', 'Ipswich', 'Urban Utilities'),
  mk('Maroochydore', '4558', 'Sunshine Coast', 'Unitywater'), mk('Mooloolaba', '4557', 'Sunshine Coast', 'Unitywater'), mk('Caloundra', '4551', 'Sunshine Coast', 'Unitywater'), mk('Buderim', '4556', 'Sunshine Coast', 'Unitywater'), mk('Nambour', '4560', 'Sunshine Coast', 'Unitywater'), mk('Coolum Beach', '4573', 'Sunshine Coast', 'Unitywater'), mk('Warana', '4575', 'Sunshine Coast', 'Unitywater'), mk('Sippy Downs', '4556', 'Sunshine Coast', 'Unitywater'),
];

export const suggestedTestSuburbs = ['South Brisbane', 'North Lakes', 'Southport', 'Loganholme', 'Cleveland', 'Beaudesert', 'Kilcoy'];
