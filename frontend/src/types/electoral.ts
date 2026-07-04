export interface HistoricalElection {
  id: number;
  type: string;
  year: number;
  state: string | null;
  source: string;
  source_url: string;
  ingested_at: string;
}

export interface PartyTally {
  party: string;
  seats: number;
}

export interface ElectionSummary {
  election: HistoricalElection;
  partyTallies: PartyTally[];
  overallTurnout: number;
  totalElectors: number;
  totalVotesPolled: number;
}

export interface ConstituencyListItem {
  id: number;
  name: string;
  state: string;
  seat_type: string;
  winner: {
    name: string;
    party: string;
    votes: number;
  } | null;
  margin: number;
}

export interface ConstituencyListResponse {
  constituencies: ConstituencyListItem[];
  total: number;
}

export interface ConstituencyDetail {
  id: number;
  name: string;
  state: string;
  seat_type: string;
  source: string;
  source_url: string;
  summary: {
    total_electors: number;
    total_votes_polled: number;
    turnout_pct: number;
    valid_votes: number;
  } | null;
  candidates: {
    id: number;
    name: string;
    party: string;
    votes: number;
    vote_share_pct: number;
    result: string;
    is_winner: boolean;
  }[];
}
