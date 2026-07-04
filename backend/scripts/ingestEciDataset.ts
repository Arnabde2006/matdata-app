import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface SeedCandidate {
  name: string;
  party: string;
  votes: number;
  vote_share_pct: number;
  is_winner: boolean;
}

interface SeedSummary {
  total_electors: number;
  total_votes_polled: number;
  turnout_pct: number;
  valid_votes: number;
}

interface SeedConstituency {
  name: string;
  state: string;
  seat_type: string;
  summary: SeedSummary;
  candidates: SeedCandidate[];
}

interface SeedElection {
  type: string;
  year: number;
  state: string | null;
  source: string;
  source_url: string;
}

interface SeedData {
  election: SeedElection;
  constituencies: SeedConstituency[];
}

function validateVotes(candidates: SeedCandidate[], validVotes: number, constituencyName: string): boolean {
  const sumVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
  const diff = Math.abs(sumVotes - validVotes);
  const tolerance = validVotes * 0.005; // 0.5% tolerance

  if (diff > tolerance) {
    console.error(
      `[VALIDATION ERROR] Constituency "${constituencyName}": Sum of candidate votes (${sumVotes}) does not match valid votes (${validVotes}) within tolerance.`
    );
    return false;
  }
  return true;
}

async function ingestFile(filePath: string) {
  console.log(`Reading seed file: ${filePath}`);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data: SeedData = JSON.parse(rawData);

  const { type, year, state, source, source_url } = data.election;

  // 1. Create or get election
  console.log(`Ingesting Election: ${type} (${year})`);
  const election = await prisma.historicalElection.create({
    data: {
      type,
      year,
      state,
      source,
      source_url,
    },
  });

  let ingestedCount = 0;
  let skippedCount = 0;

  // 2. Ingest constituencies
  for (const c of data.constituencies) {
    if (!validateVotes(c.candidates, c.summary.valid_votes, c.name)) {
      console.warn(`[INGESTION REJECTED] Skipping constituency "${c.name}" due to vote validation failure.`);
      skippedCount++;
      continue;
    }

    const constituency = await prisma.historicalConstituency.create({
      data: {
        election_id: election.id,
        name: c.name,
        state: c.state,
        seat_type: c.seat_type,
        source,
        source_url,
      },
    });

    // Ingest summary
    await prisma.historicalConstituencySummary.create({
      data: {
        constituency_id: constituency.id,
        total_electors: c.summary.total_electors,
        total_votes_polled: c.summary.total_votes_polled,
        turnout_pct: c.summary.turnout_pct,
        valid_votes: c.summary.valid_votes,
        source,
        source_url,
      },
    });

    // Ingest candidates
    for (const cand of c.candidates) {
      await prisma.historicalCandidate.create({
        data: {
          constituency_id: constituency.id,
          name: cand.name,
          party: cand.party,
          votes: cand.votes,
          vote_share_pct: cand.vote_share_pct,
          result: cand.is_winner ? 'won' : 'lost',
          is_winner: cand.is_winner,
          source,
          source_url,
        },
      });
    }

    ingestedCount++;
  }

  console.log(`Ingestion completed for ${type} (${year}). Ingested: ${ingestedCount}, Skipped: ${skippedCount}`);
}

async function main() {
  const seedFiles = [
    path.join(__dirname, '../data/seeds/lok_sabha_2019.json'),
    path.join(__dirname, '../data/seeds/lok_sabha_2024.json'),
  ];

  for (const file of seedFiles) {
    if (fs.existsSync(file)) {
      await ingestFile(file);
    } else {
      console.warn(`Seed file not found: ${file}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
