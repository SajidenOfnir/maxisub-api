const paymentService = require('../services/paymentService');
const notificationService = require('../services/notificationService');
const Subscription = require('../models/Subscription');
const ResponseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

class WebhookController {
  async handleStripeWebhook(req, res, next) {
    try {
      const signature = req.headers['stripe-signature'];
      const event = paymentService.verifyWebhookSignature(
        req.body,
        signature
      );

      logger.info('Stripe webhook received:', event.type);

      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        default:
          logger.info(`Unhandled event type: ${event.type}`);
      }

      return res.json({ received: true });
    } catch (error) {
      logger.error('Webhook error:', error);
      return ResponseHandler.error(res, 'Webhook processing failed', 400);
    }
  }

  async handlePaymentSucceeded(invoice) {
    const subscription = await Subscription.findOne({
      where: { stripe_subscription_id: invoice.subscription },
    });

    if (subscription) {
      // Update next billing date
      subscription.next_billing_date = new Date(invoice.next_payment_attempt * 1000)
        .toISOString().split('T')[0];
      await subscription.save();
      logger.info(`Payment succeeded for subscription: ${subscription.id}`);
    }
  }

  async handlePaymentFailed(invoice) {
    const subscription = await Subscription.findOne({
      where: { stripe_subscription_id: invoice.subscription },
    });

    if (subscription) {
      await notificationService.createPaymentFailureNotification(
        subscription,
        invoice.failure_reason || 'Unknown error'
      );
      logger.warn(`Payment failed for subscription: ${subscription.id}`);
    }
  }

  async handleSubscriptionDeleted(stripeSubscription) {
    const subscription = await Subscription.findOne({
      where: { stripe_subscription_id: stripeSubscription.id },
    });

    if (subscription) {
      subscription.status = 'cancelled';
      await subscription.save();
      logger.info(`Subscription cancelled: ${subscription.id}`);
    }
  }
}

module.exports = new WebhookController();