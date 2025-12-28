const request = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../config/database');
const User = require('../../models/User');
const Subscription = require('../../models/Subscription');

describe('API Integration Tests', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Authentication', () => {
    test('POST /api/v1/auth/register - should register new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          first_name: 'Test',
          last_name: 'User',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      
      authToken = response.body.data.token;
      userId = response.body.data.user.id;
    });

    test('POST /api/v1/auth/login - should login user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    test('GET /api/v1/auth/profile - should get user profile', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('test@example.com');
    });
  });

  describe('Subscriptions', () => {
    let subscriptionId;

    test('POST /api/v1/subscriptions - should create subscription', async () => {
      const response = await request(app)
        .post('/api/v1/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Netflix',
          description: 'Streaming service',
          amount: 15.99,
          currency: 'USD',
          billing_cycle: 'monthly',
          start_date: '2024-01-01',
          category: 'Entertainment',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Netflix');
      
      subscriptionId = response.body.data.id;
    });

    test('GET /api/v1/subscriptions - should get all subscriptions', async () => {
      const response = await request(app)
        .get('/api/v1/subscriptions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.subscriptions).toBeInstanceOf(Array);
      expect(response.body.data.subscriptions.length).toBeGreaterThan(0);
    });

    test('GET /api/v1/subscriptions/:id - should get subscription by id', async () => {
      const response = await request(app)
        .get(`/api/v1/subscriptions/${subscriptionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(subscriptionId);
    });

    test('PUT /api/v1/subscriptions/:id - should update subscription', async () => {
      const response = await request(app)
        .put(`/api/v1/subscriptions/${subscriptionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Netflix Premium',
          amount: 19.99,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Netflix Premium');
    });

    test('DELETE /api/v1/subscriptions/:id - should delete subscription', async () => {
      const response = await request(app)
        .delete(`/api/v1/subscriptions/${subscriptionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Analytics', () => {
    test('GET /api/v1/analytics/dashboard - should get dashboard', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.analytics).toBeDefined();
    });
  });
});