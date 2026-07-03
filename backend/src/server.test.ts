/// <reference types="jest" />
import request from 'supertest';
import { app } from './server';

// Mock the Gemini API call to prevent real requests
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'Mocked response' }
      })
    })
  }))
}));

describe('Server API Endpoints', () => {
  beforeAll(() => {
    // Avoid missing API key errors during tests
    process.env.GEMINI_API_KEY = 'test-key';
  });

  // Test 1: Health endpoint
  it('GET /api/health should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // Test 2: Chat endpoint (Mocked)
  it('POST /api/chat should return mocked response', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello', language: 'en' });
    expect(res.status).toBe(200);
    expect(res.body.response).toBe('Mocked response');
  });

  // Test 3: CORS headers presence
  it('should include CORS headers in responses', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toBeDefined();
  });


  // Test 4: Rate Limiting
  it('should be subject to rate limiting', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-ratelimit-limit']).toBeDefined();
    expect(res.headers['x-ratelimit-remaining']).toBeDefined();
  });

  // Test 5: Error handling (invalid JSON)
  it('should handle bad JSON payload gracefully', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('Content-Type', 'application/json')
      .send('{"message": "Hello", "language": "en"'); // malformed JSON
    expect(res.status).toBe(400); // Express json parser typically throws 400 for bad JSON
  });

  // Test 6: chat message empty
  it('should return 400 for POST /api/chat with empty message', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: '', language: 'en' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // Test 7: chat message over 500 chars
  it('should return 400 for POST /api/chat with message over 500 characters', async () => {
    const longMessage = 'a'.repeat(501);
    const res = await request(app)
      .post('/api/chat')
      .send({ message: longMessage, language: 'en' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // Test 8: booth search malformed epicNumber
  it('should return 400 for POST /api/booth with malformed epicNumber', async () => {
    const res = await request(app)
      .post('/api/booth')
      .send({ epicNumber: '123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // Test 9: booth search valid epicNumber
  it('should return 200 and isDemoData: true for POST /api/booth with valid epicNumber', async () => {
    const res = await request(app)
      .post('/api/booth')
      .send({ epicNumber: 'ABC1234567' });
    expect(res.status).toBe(200);
    expect(res.body.isDemoData).toBe(true);
    expect(res.body.epicNumber).toBe('ABC1234567');
  });

  // Feature 1 - States List Endpoint
  it('GET /api/states should return 200 and a list of states', async () => {
    const res = await request(app).get('/api/states');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name_en).toBeDefined();
  });

  // Feature 1 - Timeline Endpoint (Passing)
  it('GET /api/timeline should return 200 and timeline events', async () => {
    const res = await request(app).get('/api/timeline');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Feature 1 - Timeline Endpoint with stateId (Passing)
  it('GET /api/timeline?stateId=1 should return 200 and filtered timeline events', async () => {
    const res = await request(app).get('/api/timeline?stateId=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Feature 1 - Timeline Endpoint with invalid stateId format (Failing)
  it('GET /api/timeline?stateId=abc should return 400', async () => {
    const res = await request(app).get('/api/timeline?stateId=abc');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // Feature 1 - Timeline Endpoint with negative stateId (Failing)
  it('GET /api/timeline?stateId=-1 should return 400', async () => {
    const res = await request(app).get('/api/timeline?stateId=-1');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // Feature 4 - Candidates list
  it('GET /api/candidates should return 200 and all candidates', async () => {
    const res = await request(app).get('/api/candidates');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].party).toBeDefined();
  });

  // Feature 4 - Candidates comparison (Passing)
  it('GET /api/candidates/compare?ids=1,2 should return 200 and candidates matching ids', async () => {
    const res = await request(app).get('/api/candidates/compare?ids=1,2');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  // Feature 4 - Candidates comparison with too few IDs (Failing)
  it('GET /api/candidates/compare?ids=1 should return 400', async () => {
    const res = await request(app).get('/api/candidates/compare?ids=1');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // Feature 4 - Candidates comparison with too many IDs (Failing)
  it('GET /api/candidates/compare?ids=1,2,3,4 should return 400', async () => {
    const res = await request(app).get('/api/candidates/compare?ids=1,2,3,4');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // Feature 4 - Candidates comparison with malformed IDs (Failing)
  it('GET /api/candidates/compare?ids=abc,2 should return 400', async () => {
    const res = await request(app).get('/api/candidates/compare?ids=abc,2');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

