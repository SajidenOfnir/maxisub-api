const stripe = require('stripe')(require('../config/env').stripe.secretKey);
const logger = require('../utils/logger');

class PaymentService {
  async createCustomer(email, name) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
      });
      return customer;
    } catch (error) {
      logger.error('Stripe customer creation failed:', error);
      throw error;
    }
  }

  async createSubscription(customerId, priceId) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
      });
      return subscription;
    } catch (error) {
      logger.error('Stripe subscription creation failed:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      logger.error('Stripe subscription cancellation failed:', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionId, params) {
    try {
      const subscription = await stripe.subscriptions.update(
        subscriptionId,
        params
      );
      return subscription;
    } catch (error) {
      logger.error('Stripe subscription update failed:', error);
      throw error;
    }
  }

  verifyWebhookSignature(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        require('../config/env').stripe.webhookSecret
      );
      return event;
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();