import request from 'supertest';
import { app } from './server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const res = await request(app).get('/api/health');
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
});
