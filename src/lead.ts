import type { LeadPayload, Region, Suburb, WaterReportProfile } from './dataModels';
import type { Attribution } from './attribution';

export const buildLeadPayload = (args: {
  first_name: string; email: string; phone?: string; main_concern: string;
  suburb: Suburb; region: Region; profile: WaterReportProfile; attribution: Attribution;
}): LeadPayload => ({
  first_name: args.first_name,
  email: args.email,
  phone: args.phone,
  suburb: args.suburb.suburb,
  postcode: args.suburb.postcode,
  water_source_type: args.region.waterSourceType,
  main_concern: args.main_concern,
  region_name: args.region.name,
  region_slug: args.region.slug,
  report_profile: args.profile.profileName,
  provider_guess: args.region.providerGuess,
  recommended_system: args.region.recommendedSystem,
  report_url: window.location.href,
  ...args.attribution,
  timestamp: new Date().toISOString(),
});
