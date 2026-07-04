import { prisma } from '../server';
import { getResourceConfig } from '../config/electoralDataSources';

export interface ElectionListItem {
  id: number;
  type: string;
  year: number;
  state: string | null;
  source: string;
  source_url: string;
  ingested_at: Date;
}

export interface PartyTally {
  party: string;
  seats: number;
}

export interface ElectionSummary {
  election: ElectionListItem;
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

// Validation function: returns true if candidate votes sum is within 0.5% of valid_votes
export function validateVoteSum(candidateVotes: number[], validVotes: number): boolean {
  if (validVotes <= 0) return false;
  const sum = candidateVotes.reduce((acc, v) => acc + v, 0);
  const diff = Math.abs(sum - validVotes);
  const tolerance = validVotes * 0.005; // 0.5% tolerance
  return diff <= tolerance;
}

export async function listElections(): Promise<ElectionListItem[]> {
  return prisma.historicalElection.findMany({
    orderBy: [
      { year: 'desc' },
      { type: 'asc' }
    ]
  });
}

export async function getElectionSummary(electionId: number): Promise<ElectionSummary | null> {
  const election = await prisma.historicalElection.findUnique({
    where: { id: electionId },
    include: {
      constituencies: {
        include: {
          candidates: true,
          summary: true,
        }
      }
    }
  });

  if (!election) return null;

  // Calculate party tallies
  const partyWins: Record<string, number> = {};
  let totalElectors = 0;
  let totalVotesPolled = 0;

  for (const c of election.constituencies) {
    const winner = c.candidates.find(cand => cand.is_winner);
    if (winner) {
      partyWins[winner.party] = (partyWins[winner.party] || 0) + 1;
    }
    if (c.summary) {
      totalElectors += c.summary.total_electors;
      totalVotesPolled += c.summary.total_votes_polled;
    }
  }

  const partyTallies: PartyTally[] = Object.entries(partyWins)
    .map(([party, seats]) => ({ party, seats }))
    .sort((a, b) => b.seats - a.seats);

  const overallTurnout = totalElectors > 0 ? (totalVotesPolled / totalElectors) * 100 : 0;

  return {
    election: {
      id: election.id,
      type: election.type,
      year: election.year,
      state: election.state,
      source: election.source,
      source_url: election.source_url,
      ingested_at: election.ingested_at,
    },
    partyTallies,
    overallTurnout: parseFloat(overallTurnout.toFixed(2)),
    totalElectors,
    totalVotesPolled,
  };
}

export async function getElectionConstituencies(
  electionId: number,
  search: string = '',
  offset: number = 0,
  limit: number = 10
): Promise<{ constituencies: ConstituencyListItem[]; total: number }> {
  const whereClause = {
    election_id: electionId,
    ...(search ? { name: { contains: search } } : {})
  };

  const total = await prisma.historicalConstituency.count({
    where: whereClause
  });

  const dbConstituencies = await prisma.historicalConstituency.findMany({
    where: whereClause,
    include: {
      candidates: {
        orderBy: { votes: 'desc' }
      },
      summary: true
    },
    skip: offset,
    take: limit,
    orderBy: { name: 'asc' }
  });

  const constituencies: ConstituencyListItem[] = dbConstituencies.map(c => {
    const sortedCands = c.candidates;
    const winner = sortedCands[0] || null;
    const runnerUp = sortedCands[1] || null;
    const margin = winner && runnerUp ? winner.votes - runnerUp.votes : (winner ? winner.votes : 0);

    return {
      id: c.id,
      name: c.name,
      state: c.state,
      seat_type: c.seat_type,
      winner: winner ? { name: winner.name, party: winner.party, votes: winner.votes } : null,
      margin,
    };
  });

  return { constituencies, total };
}

export async function getConstituencyDetail(
  electionId: number,
  constituencyId: number
): Promise<ConstituencyDetail | null> {
  const constituency = await prisma.historicalConstituency.findFirst({
    where: {
      id: constituencyId,
      election_id: electionId
    },
    include: {
      candidates: {
        orderBy: { votes: 'desc' }
      },
      summary: true
    }
  });

  if (!constituency) return null;

  return {
    id: constituency.id,
    name: constituency.name,
    state: constituency.state,
    seat_type: constituency.seat_type,
    source: constituency.source,
    source_url: constituency.source_url,
    summary: constituency.summary ? {
      total_electors: constituency.summary.total_electors,
      total_votes_polled: constituency.summary.total_votes_polled,
      turnout_pct: constituency.summary.turnout_pct,
      valid_votes: constituency.summary.valid_votes
    } : null,
    candidates: constituency.candidates.map(cand => ({
      id: cand.id,
      name: cand.name,
      party: cand.party,
      votes: cand.votes,
      vote_share_pct: cand.vote_share_pct,
      result: cand.result,
      is_winner: cand.is_winner
    }))
  };
}

/**
 * Syncs election data from data.gov.in API for a given type, year, and state.
 * Returns true if synchronization was performed, or false/throws if not possible.
 */
export async function syncFromDataGovIn(type: string, year: number, state: string | null = null): Promise<boolean> {
  const config = getResourceConfig(type, year, state);
  if (!config) {
    console.log(`No resource ID configured for election: ${type} ${year}`);
    return false;
  }

  const apiKey = process.env.DATA_GOV_IN_API_KEY;
  if (!apiKey) {
    console.warn('DATA_GOV_IN_API_KEY not set. Skipping live sync.');
    return false;
  }

  // Check if we already have this election cached to prevent hitting data.gov.in rate limits
  const existingElection = await prisma.historicalElection.findFirst({
    where: { type, year, state }
  });
  if (existingElection) {
    console.log(`Election ${type} ${year} is already cached. Skipping API sync.`);
    return true;
  }

  console.log(`Starting live sync from data.gov.in for resource: ${config.resourceId}`);

  // Fetch all records with pagination
  let offset = 0;
  const limit = 100;
  let allRecords: any[] = [];
  let hasMore = true;
  let sourceName = config.source;
  let sourceUrl = config.source_url;

  while (hasMore) {
    // If in test mode, allow using a mock fetch or dummy API key behavior
    const url = `https://api.data.gov.in/resource/${config.resourceId}?api-key=${apiKey}&format=json&offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Upstream source failed: data.gov.in returned HTTP ${response.status}`);
    }

    const data: any = await response.json();
    const records = data.records || [];
    allRecords = allRecords.concat(records);

    if (records.length < limit || allRecords.length >= (data.total || 0)) {
      hasMore = false;
    } else {
      offset += limit;
    }
  }

  if (allRecords.length === 0) {
    throw new Error('No data exists for this query in the upstream source.');
  }

  // Create the election first
  const election = await prisma.historicalElection.create({
    data: {
      type,
      year,
      state,
      source: sourceName,
      source_url: sourceUrl
    }
  });

  // Group records by constituency. 
  // Each record from data.gov.in typically represents a candidate row in a constituency.
  // Record structure assumptions (mapped from common data.gov.in format):
  // {
  //   state: "Uttar Pradesh",
  //   constituency_name: "Varanasi",
  //   constituency_type: "general" / "SC" / "ST",
  //   candidate_name: "Narendra Modi",
  //   party: "BJP",
  //   votes: 674664,
  //   vote_share_percentage: 65.99,
  //   is_winner: "true" / "yes" / 1,
  //   total_electors: 1856791,
  //   total_votes_polled: 1060829,
  //   turnout_percentage: 57.12,
  //   valid_votes: 1022371
  // }
  const constituenciesMap: Record<string, {
    state: string;
    seat_type: string;
    summary: {
      total_electors: number;
      total_votes_polled: number;
      turnout_pct: number;
      valid_votes: number;
    };
    candidates: {
      name: string;
      party: string;
      votes: number;
      vote_share_pct: number;
      is_winner: boolean;
    }[];
  }> = {};

  for (const record of allRecords) {
    // Normalise names of fields since different data.gov.in datasets might use slightly different column names
    const stateName = record.state || record.state_name || state || 'Unknown';
    const cName = record.constituency_name || record.constituency || 'Unknown';
    const seatType = record.constituency_type || record.seat_type || 'general';
    const candName = record.candidate_name || record.candidate || 'Unknown';
    const party = record.party || record.party_name || 'IND';
    const votes = parseInt(record.votes || record.candidate_votes || '0', 10);
    const voteShare = parseFloat(record.vote_share_percentage || record.vote_share_pct || record.vote_share || '0');
    const isWinner = record.is_winner === 'true' || record.is_winner === 'yes' || record.is_winner === '1' || record.result?.toLowerCase() === 'won';

    const totalElectors = parseInt(record.total_electors || record.electors || '0', 10);
    const totalVotesPolled = parseInt(record.total_votes_polled || record.votes_polled || '0', 10);
    const turnoutPct = parseFloat(record.turnout_percentage || record.turnout_pct || '0');
    const validVotes = parseInt(record.valid_votes || record.total_valid_votes || '0', 10);

    if (!constituenciesMap[cName]) {
      constituenciesMap[cName] = {
        state: stateName,
        seat_type: seatType,
        summary: {
          total_electors: totalElectors,
          total_votes_polled: totalVotesPolled,
          turnout_pct: turnoutPct,
          valid_votes: validVotes
        },
        candidates: []
      };
    }

    constituenciesMap[cName].candidates.push({
      name: candName,
      party,
      votes,
      vote_share_pct: voteShare,
      is_winner: isWinner
    });
  }

  for (const [cName, cData] of Object.entries(constituenciesMap)) {
    const candidateVotes = cData.candidates.map(cand => cand.votes);
    const validVotes = cData.summary.valid_votes;

    // Validate vote sum
    if (!validateVoteSum(candidateVotes, validVotes)) {
      console.warn(`[VALIDATION WARNING] Live sync constituency "${cName}" failed vote consistency check. Mismatch detected. Skipping ingestion of this constituency.`);
      continue;
    }

    const constituency = await prisma.historicalConstituency.create({
      data: {
        election_id: election.id,
        name: cName,
        state: cData.state,
        seat_type: cData.seat_type,
        source: sourceName,
        source_url: sourceUrl
      }
    });

    await prisma.historicalConstituencySummary.create({
      data: {
        constituency_id: constituency.id,
        total_electors: cData.summary.total_electors,
        total_votes_polled: cData.summary.total_votes_polled,
        turnout_pct: cData.summary.turnout_pct,
        valid_votes: cData.summary.valid_votes,
        source: sourceName,
        source_url: sourceUrl
      }
    });

    for (const cand of cData.candidates) {
      await prisma.historicalCandidate.create({
        data: {
          constituency_id: constituency.id,
          name: cand.name,
          party: cand.party,
          votes: cand.votes,
          vote_share_pct: cand.vote_share_pct,
          result: cand.is_winner ? 'won' : 'lost',
          is_winner: cand.is_winner,
          source: sourceName,
          source_url: sourceUrl
        }
      });
    }
  }

  console.log(`Live sync from data.gov.in completed successfully.`);
  return true;
}
