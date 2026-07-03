export interface State {
  id: number;
  name_en: string;
  name_hi: string;
  constituencies_count: number;
}

export interface Constituency {
  id: number;
  state_id: number;
  name_en: string;
  name_hi: string;
  type: string;
  state?: State;
}

export interface Party {
  id: number;
  name_en: string;
  name_hi: string;
  symbol: string;
  colors: string;
  founded_year: number;
}

export interface Candidate {
  id: number;
  name_en: string;
  name_hi: string;
  party_id: number;
  constituency_id: number;
  photo_url?: string | null;
  assets?: string | null;
  criminal_cases: number;
  age: number;
  education: string;
  party: Party;
  constituency: Constituency;
}
