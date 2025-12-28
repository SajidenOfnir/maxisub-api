const Subscription = require('../../models/Subscription');
const User = require('../../models/User');
const { sequelize } = require('../../config/database');

describe('Subscription Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
    });
  });

  afterEach(async () => {
    await Subscription.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  test('should create a subscription', async () => {
    const subscription = await Subscription.create({
      user_id: testUser.id,
      name: 'Netflix',
      amount: 15.99,
      currency: 'USD',
      billing_cycle: 'monthly',
      start_date: '2024-01-01',
      next_billing_date: '2024-02-01',
    });

    expect(subscription.id).toBeDefined();
    expect(subscription.name).toBe('Netflix');
    expect(subscription.amount).toBe('15.99');
  });

  test('should validate billing cycle', async () => {
    await expect(
      Subscription.create({
        user_id: testUser.id,
        name: 'Test',
        amount: 10,
        billing_cycle: 'invalid',
        start_date: '2024-01-01',
        next_billing_date: '2024-02-01',
      })
    ).rejects.toThrow();
  });

  test('should have default status as active', async () => {
    const subscription = await Subscription.create({
      user_id: testUser.id,
      name: 'Spotify',
      amount: 9.99,
      billing_cycle: 'monthly',
      start_date: '2024-01-01',
      next_billing_date: '2024-02-01',
    });

    expect(subscription.status).toBe('active');
  });
});