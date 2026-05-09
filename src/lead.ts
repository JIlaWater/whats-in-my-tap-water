export type LeadPayload = {
  suburb: string; postcode: string; email: string; main_concern: string; searched_query: string; matched_region: string; report_url: string;
  utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; gclid?: string; fbclid?: string; timestamp: string;
};

export const buildLeadPayload = (payload: Omit<LeadPayload, 'timestamp'>): LeadPayload => ({ ...payload, timestamp: new Date().toISOString() });
