import type { WaterProfile } from '../dataModels';

const baseSources = [
  'Seqwater Water Quality Report (March 2026) for relevant service area; publication month: March 2026; checked: 2026-05-09.',
  'Queensland Health drinking water guidance and ADWG alignment notes; checked: 2026-05-09.',
  'Urban Utilities / local water retailer network and treatment guidance pages; checked: 2026-05-09.',
];

const mk = (slug: string, profileName: string, profileType: WaterProfile['profileType'], regionLabel: string): WaterProfile => ({
  slug, profileName, profileType, regionLabel,
  headline: `${profileName} Tap Water Snapshot`,
  summary: 'Based on available public supply context and household conditions that may influence taste, smell, comfort and scale outcomes.',
  supplyContext: 'Public tap water in SEQ is treated and regulated. Final in-home experience can still vary with plumbing materials, stagnation time, fixture condition and property storage.',
  commonConcerns: ['Chlorine/chloramine taste or smell may be noticeable at times.', 'Sediment or pipe-related particles can occur in older plumbing.', 'Hardness and scale tendencies may affect kettles, showers and appliances.'],
  likelyNoticeableIssues: ['Chlorine smell at tap or in shower steam.', 'Kettle spotting or glass marks.', 'Dry skin/hair feeling after showers.', 'Filter cartridges darkening faster than expected.'],
  householdFactors: ['Pipe age and internal plumbing condition.', 'Duration of water stagnation in household lines.', 'Point-of-use fixture and aerator cleanliness.', 'Rainwater tank or alternate water connections where present.'],
  recommendedTesting: ['Flush taps after long stagnation periods.', 'Check existing filter cartridge condition and replacement schedule.', 'Use property-level testing for chlorine/chloramine, hardness and sediment indicators.', 'Book a free home water assessment for property-specific filtration design.'],
  jilaRecommendation: 'Book a free home water assessment with Jila Water for a property-specific plan.',
  ctaTitle: 'Want to know what’s really coming through your taps?',
  ctaCopy: 'Jila Water can test your home’s water and recommend the right whole home filtration setup for your property.',
  shareHeadlineTemplate: 'I checked what may be affecting tap water in {{suburb}}.',
  shareTextTemplate: 'Here’s the local snapshot for {{suburb}} — regional guidance, practical next steps, and property-level testing advice.',
  disclaimer: 'This is guidance, not a lab result. Property-level testing is recommended for certainty.',
  sourceNotes: baseSources,
  confidenceLabel: profileType === 'suburb_specific' ? 'High' : 'Medium',
  coverageLabel: profileType === 'suburb_specific' ? 'Suburb + regional context' : profileType === 'regional_guidance' ? 'Regional supply context' : 'SEQ-wide guidance',
  freshnessLabel: 'Public source set reviewed 2026-05-09',
});

export const waterProfiles: WaterProfile[] = [
  mk('brisbane-cbd-4000','Brisbane CBD','suburb_specific','Brisbane Central'), mk('brisbane-suburb','Brisbane','suburb_specific','Brisbane Central'), mk('south-brisbane-4101','South Brisbane','suburb_specific','Brisbane South'), mk('west-end-4101','West End','suburb_specific','Brisbane South'), mk('caboolture-suburb','Caboolture','suburb_specific','Moreton Bay'),
  mk('brisbane-north-regional','Brisbane North','regional_guidance','Brisbane North'), mk('brisbane-south-regional','Brisbane South','regional_guidance','Brisbane South'), mk('brisbane-east-regional','Brisbane East','regional_guidance','Brisbane East'), mk('brisbane-west-regional','Brisbane West','regional_guidance','Brisbane West'), mk('moreton-bay-regional','Moreton Bay','regional_guidance','Moreton Bay'), mk('redlands-bayside-regional','Redlands / Bayside','regional_guidance','Redlands / Bayside'), mk('logan-regional','Logan','regional_guidance','Logan'), mk('ipswich-regional','Ipswich','regional_guidance','Ipswich'), mk('gold-coast-regional','Gold Coast','regional_guidance','Gold Coast'), mk('sunshine-coast-regional','Sunshine Coast','regional_guidance','Sunshine Coast'), mk('noosa-regional','Noosa','regional_guidance','Noosa'), mk('scenic-rim-regional','Scenic Rim','regional_guidance','Scenic Rim'), mk('somerset-regional','Somerset','regional_guidance','Somerset'), mk('lockyer-valley-regional','Lockyer Valley','regional_guidance','Lockyer Valley'), mk('toowoomba-regional','Toowoomba','regional_guidance','Toowoomba'), mk('seq-fallback-regional','SEQ Regional Guidance','fallback_guidance','South East Queensland')
];

export const profileBySlug = Object.fromEntries(waterProfiles.map((p) => [p.slug, p]));
