/// <reference types="jest" />
import request from 'supertest';
import { app } from '../server';
import { prisma } from '../server';

describe('Electoral Data API Endpoints', () => {
  let testElectionId: number;
  let testConstituencyId: number;

  beforeAll(async () => {
    // Find the first election from the seed database
    const election = await prisma.historicalElection.findFirst({
      include: {
        constituencies: true
      }
    });

    if (election && election.constituencies.length > 0) {
      testElectionId = election.id;
      testConstituencyId = election.constituencies[0].id;
    } else {
      // Create fallback dummy data if database is empty for some reason
      const el = await prisma.historicalElection.create({
        data: {
          type: 'Lok Sabha',
          year: 2019,
          state: null,
          source: 'ECI',
          source_url: 'https://results.eci.gov.in/'
        }
      });
      const con = await prisma.historicalConstituency.create({
        data: {
          election_id: el.id,
          name: 'Varanasi',
          state: 'Uttar Pradesh',
          seat_type: 'general',
          source: 'ECI',
          source_url: 'https://results.eci.gov.in/'
        }
      });
      await prisma.historicalConstituencySummary.create({
        data: {
          constituency_id: con.id,
          total_electors: 1000000,
          total_votes_polled: 600000,
          turnout_pct: 60,
          valid_votes: 590000,
          source: 'ECI',
          source_url: 'https://results.eci.gov.in/'
        }
      });
      await prisma.historicalCandidate.create({
        data: {
          constituency_id: con.id,
          name: 'Test Candidate',
          party: 'TEST',
          votes: 590000,
          vote_share_pct: 100,
          result: 'won',
          is_winner: true,
          source: 'ECI',
          source_url: 'https://results.eci.gov.in/'
        }
      });
      testElectionId = el.id;
      testConstituencyId = con.id;
    }
  });

  // Test 1: Get all elections
  it('GET /api/elections should return list of elections', async () => {
    const res = await request(app).get('/api/elections');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('type');
    expect(res.body[0]).toHaveProperty('year');
    expect(res.body[0]).toHaveProperty('source');
  });

  // Test 2: Get election summary
  it('GET /api/elections/:electionId/summary should return election summary details', async () => {
    const res = await request(app).get(`/api/elections/${testElectionId}/summary`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('election');
    expect(res.body).toHaveProperty('partyTallies');
    expect(res.body).toHaveProperty('overallTurnout');
    expect(res.body.election.id).toBe(testElectionId);
  });

  // Test 3: Get constituencies
  it('GET /api/elections/:electionId/constituencies should return constituencies list', async () => {
    const res = await request(app).get(`/api/elections/${testElectionId}/constituencies`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('constituencies');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.constituencies)).toBe(true);
  });

  // Test 4: Search constituencies
  it('GET /api/elections/:electionId/constituencies?search=Varanasi should filter constituencies', async () => {
    const res = await request(app).get(`/api/elections/${testElectionId}/constituencies?search=Varanasi`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('constituencies');
    if (res.body.constituencies.length > 0) {
      expect(res.body.constituencies[0].name.toLowerCase()).toContain('varanasi');
    }
  });

  // Test 5: Get constituency detail
  it('GET /api/elections/:electionId/constituencies/:constituencyId should return candidate breakdown', async () => {
    const res = await request(app).get(`/api/elections/${testElectionId}/constituencies/${testConstituencyId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('summary');
    expect(res.body).toHaveProperty('candidates');
    expect(Array.isArray(res.body.candidates)).toBe(true);
    expect(res.body.candidates.length).toBeGreaterThan(0);
    expect(res.body.source).toBeDefined();
  });

  // Test 6: Get invalid election
  it('GET /api/elections/9999/summary should return 404', async () => {
    const res = await request(app).get('/api/elections/9999/summary');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  // Test 7: Manual sync failure due to missing API key or wrong resource config
  it('POST /api/elections/sync with invalid config should return 400', async () => {
    const res = await request(app)
      .post('/api/elections/sync')
      .send({ type: 'NonExistent', year: 2000 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
