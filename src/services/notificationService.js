const Notification = require('../models/Notification');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const emailService = require('./emailService');
const logger = require('../utils/logger');
const { Op } = require('sequelize');
const config = require('../config/env');

class NotificationService {
  async checkUpcomingRenewals() {
    try {
      const daysToCheck = config.notification.daysBeforeRenewal;

      for (const days of daysToCheck) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);

        const subscriptions = await Subscription.findAll({
          where: {
            next_billing_date: targetDate.toISOString().split('T')[0],
            status: 'active',
            reminder_enabled: true,
          },
          include: [{
            model: User,
            as: 'user',
          }],
        });

        for (const subscription of subscriptions) {
          await this.createRenewalNotification(subscription, days);
          await emailService.sendRenewalReminder(
            subscription.user,
            subscription,
            days
          );
        }

        logger.info(`Processed ${subscriptions.length} renewal notifications for ${days} days`);
      }
    } catch (error) {
      logger.error('Error checking upcoming renewals:', error);
    }
  }

  async createRenewalNotification(subscription, daysUntilRenewal) {
    return await Notification.create({
      user_id: subscription.user_id,
      subscription_id: subscription.id,
      type: 'renewal_reminder',
      message: `Your subscription "${subscription.name}" will renew in ${daysUntilRenewal} day(s).`,
      sent_at: new Date(),
    });
  }

  async createPaymentFailureNotification(subscription, reason) {
    const notification = await Notification.create({
      user_id: subscription.user_id,
      subscription_id: subscription.id,
      type: 'payment_failure',
      message: `Payment failed for subscription "${subscription.name}". Reason: ${reason}`,
      sent_at: new Date(),
    });

    const user = await User.findByPk(subscription.user_id);
    await emailService.sendPaymentFailureNotification(user, subscription, reason);

    return notification;
  }

  async getUserNotifications(userId, isRead = null) {
    const where = { user_id: userId };
    if (isRead !== null) {
      where.is_read = isRead;
    }

    return await Notification.findAll({
      where,
      include: [{
        model: Subscription,
        as: 'subscription',
        attributes: ['id', 'name'],
      }],
      order: [['created_at', 'DESC']],
    });
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (notification) {
      notification.is_read = true;
      await notification.save();
    }

    return notification;
  }
}

module.exports = new NotificationService();