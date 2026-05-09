export type ReviewedWaterRecord = {
  record_id: string; region: string; state: string; water_authority: string; source_owner: string; source_file_name: string; source_type: string; parameter_name: string; min_value: string; average_value: string; max_value: string; unit: string; number_of_samples: string; report_month: string; source_page: string; coverage_level: string; confidence_level: string; review_status: string; reviewer_notes: string;
};

const base = {
  region: 'Brisbane', state: 'QLD', water_authority: 'Urban Utilities', source_owner: 'Seqwater', source_file_name: 'Seqwater Water Quality Report - Brisbane - 2026-03.pdf', source_type: 'monthly_water_quality_report_pdf', report_month: '2026-03', coverage_level: 'authority', confidence_level: 'medium', review_status: 'reviewed', reviewer_notes: 'Checked against uploaded Seqwater Brisbane March 2026 PDF. Authority-level monthly data, not individual household tap testing.'
};

export const brisbaneMarch2026ReviewedData: ReviewedWaterRecord[] = [
  { ...base, record_id: 'bris_m2026_001', parameter_name: 'Fluoride', min_value: '0.73', average_value: '0.81', max_value: '0.88', unit: 'mg/L', number_of_samples: '35', source_page: 'page 1' },
  { ...base, record_id: 'bris_m2026_002', parameter_name: 'Free Chlorine', min_value: '<0.1', average_value: '0.1', max_value: '0.2', unit: 'mg/L', number_of_samples: '8', source_page: 'page 1' },
  { ...base, record_id: 'bris_m2026_003', parameter_name: 'Monochloramine', min_value: '2.4', average_value: '3.0', max_value: '3.6', unit: 'mg/L', number_of_samples: '33', source_page: 'page 1' },
  { ...base, record_id: 'bris_m2026_004', parameter_name: 'Total Chlorine', min_value: '2.4', average_value: '3.1', max_value: '3.8', unit: 'mg/L', number_of_samples: '33', source_page: 'page 1' },
  { ...base, record_id: 'bris_m2026_005', parameter_name: 'Hardness', min_value: '93.0', average_value: '113.2', max_value: '130.0', unit: 'mg/L', number_of_samples: '14', source_page: 'page 2' },
  { ...base, record_id: 'bris_m2026_006', parameter_name: 'pH', min_value: '7.7', average_value: '7.9', max_value: '8.1', unit: 'pH Unit', number_of_samples: '33', source_page: 'page 2' },
  { ...base, record_id: 'bris_m2026_007', parameter_name: 'Total Dissolved Solids', min_value: '240.0', average_value: '267.5', max_value: '300.0', unit: 'mg/L', number_of_samples: '8', source_page: 'page 2' },
  { ...base, record_id: 'bris_m2026_008', parameter_name: 'Turbidity', min_value: '0.2', average_value: '0.4', max_value: '1.1', unit: 'NTU', number_of_samples: '27', source_page: 'page 3' },
  { ...base, record_id: 'bris_m2026_009', parameter_name: 'Alkalinity Total', min_value: '83.0', average_value: '86.3', max_value: '90.0', unit: 'mg/L', number_of_samples: '6', source_page: 'page 3' },
  { ...base, record_id: 'bris_m2026_010', parameter_name: 'Geosmin', min_value: '<2.0', average_value: '2.3', max_value: '3.9', unit: 'ng/L', number_of_samples: '24', source_page: 'page 3' },
  { ...base, record_id: 'bris_m2026_011', parameter_name: '2-Methylisoborneol / MIB', min_value: '2.1', average_value: '2.7', max_value: '3.9', unit: 'ng/L', number_of_samples: '24', source_page: 'page 3' },
];
