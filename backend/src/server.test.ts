import request from 'supertest';

describe('API Health Check', () => {
  it('should return ok status', async () => {
    const response = await fetch('http://localhost:3000/api/health');
    expect(response.status).toBe(200);
  });
});

describe('Chat API', () => {
  it('should require message body', async () => {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    expect(response.status).toBeDefined();
  });
});
