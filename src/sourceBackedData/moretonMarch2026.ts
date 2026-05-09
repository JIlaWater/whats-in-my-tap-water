import type { ReviewedWaterRecord } from './brisbaneMarch2026';

const base = {
  region: 'Moreton',
  state: 'QLD',
  water_authority: 'Unitywater',
  source_owner: 'Seqwater',
  source_file_name: 'Seqwater Water Quality Report - Moreton - 2026-03.pdf',
  source_type: 'monthly_water_quality_report_pdf',
  report_month: '2026-03',
  coverage_level: 'authority',
  confidence_level: 'medium',
  review_status: 'reviewed',
  reviewer_notes: 'Checked against uploaded Seqwater Moreton March 2026 PDF. Authority-level monthly data, not individual household tap testing.',
};

export const moretonMarch2026ReviewedData: ReviewedWaterRecord[] = [
  { ...base, record_id: 'moreton_m2026_001', parameter_name: 'Fluoride', min_value: '0.70', average_value: '0.81', max_value: '0.88', unit: 'mg/L', number_of_samples: '20', source_page: '1' },
  { ...base, record_id: 'moreton_m2026_002', parameter_name: 'Free Chlorine', min_value: '0.1', average_value: '0.4', max_value: '1.7', unit: 'mg/L', number_of_samples: '24', source_page: '1' },
  { ...base, record_id: 'moreton_m2026_003', parameter_name: 'Monochloramine', min_value: '2.5', average_value: '2.9', max_value: '3.5', unit: 'mg/L', number_of_samples: '19', source_page: '1' },
  { ...base, record_id: 'moreton_m2026_004', parameter_name: 'Total Chlorine', min_value: '1.1', average_value: '2.7', max_value: '3.5', unit: 'mg/L', number_of_samples: '24', source_page: '1' },
  { ...base, record_id: 'moreton_m2026_005', parameter_name: 'Hardness', min_value: '55.0', average_value: '72.3', max_value: '100.0', unit: 'mg/L', number_of_samples: '4', source_page: '2' },
  { ...base, record_id: 'moreton_m2026_006', parameter_name: 'pH', min_value: '7.0', average_value: '7.6', max_value: '8.0', unit: 'pH Unit', number_of_samples: '24', source_page: '3' },
  { ...base, record_id: 'moreton_m2026_007', parameter_name: 'Total Dissolved Solids', min_value: '120.0', average_value: '190.0', max_value: '280.0', unit: 'mg/L', number_of_samples: '4', source_page: '3' },
  { ...base, record_id: 'moreton_m2026_008', parameter_name: 'Turbidity', min_value: '0.2', average_value: '0.3', max_value: '0.5', unit: 'NTU', number_of_samples: '13', source_page: '3' },
  { ...base, record_id: 'moreton_m2026_009', parameter_name: 'Alkalinity Total', min_value: '42.0', average_value: '42.0', max_value: '42.0', unit: 'mg/L', number_of_samples: '2', source_page: '3' },
  { ...base, record_id: 'moreton_m2026_010', parameter_name: 'Geosmin', min_value: '<2.0', average_value: '<2.0', max_value: '<2.0', unit: 'ng/L', number_of_samples: '5', source_page: '3' },
  { ...base, record_id: 'moreton_m2026_011', parameter_name: '2-Methylisoborneol / MIB', min_value: '2.8', average_value: '4.1', max_value: '5.8', unit: 'ng/L', number_of_samples: '5', source_page: '3' },
];
