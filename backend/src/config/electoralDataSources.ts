export interface ElectoralResourceConfig {
  resourceId: string;
  type: string;
  year: number;
  state: string | null;
  source: string;
  source_url: string;
}

export const electoralDataSources: Record<string, ElectoralResourceConfig> = {
  'lok_sabha_2019': {
    resourceId: '3724c9c1-19b0-466d-8c10-2fa2ef6e91f0',
    type: 'Lok Sabha',
    year: 2019,
    state: null,
    source: 'data.gov.in',
    source_url: 'https://api.data.gov.in/resource/3724c9c1-19b0-466d-8c10-2fa2ef6e91f0'
  },
  'lok_sabha_2024': {
    resourceId: 'a392de49-d3e9-4e78-9e6e-2abf12f9b8c2',
    type: 'Lok Sabha',
    year: 2024,
    state: null,
    source: 'data.gov.in',
    source_url: 'https://api.data.gov.in/resource/a392de49-d3e9-4e78-9e6e-2abf12f9b8c2'
  }
};

export function getResourceConfig(type: string, year: number, state: string | null = null): ElectoralResourceConfig | undefined {
  const key = `${type.toLowerCase().replace(/\s+/g, '_')}_${year}${state ? `_${state.toLowerCase().replace(/\s+/g, '_')}` : ''}`;
  return electoralDataSources[key];
}
