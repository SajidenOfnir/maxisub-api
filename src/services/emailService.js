const nodemailer = require('nodemailer');
const config = require('../config/env');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        html,
      });

      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendRenewalReminder(user, subscription, daysUntilRenewal) {
    const subject = `Subscription Renewal Reminder - ${subscription.name}`;
    const html = `
      Subscription Renewal Reminder
      Hello ${user.first_name},
      Your subscription to ${subscription.name} will renew in ${daysUntilRenewal} day(s).
      Details:
      
        Amount: ${subscription.currency} ${subscription.amount}
        Next billing date: ${subscription.next_billing_date}
        Billing cycle: ${subscription.billing_cycle}
      
      Thank you for using Maxisub!
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendPaymentFailureNotification(user, subscription, reason) {
    const subject = `Payment Failed - ${subscription.name}`;
    const html = `
      Payment Failure Notification
      Hello ${user.first_name},
      We were unable to process the payment for your subscription: ${subscription.name}
      Reason: ${reason}
      Please update your payment method to continue your subscription.
      Thank you for using Maxisub!
    `;

    return this.sendEmail(user.email, subject, html);
  }
}

module.exports = new EmailService();