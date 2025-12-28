const cron = require('node-cron');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

// Run every day at 9 AM
const scheduleNotifications = () => {
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running notification check cron job');
    try {
      await notificationService.checkUpcomingRenewals();
      logger.info('Notification check completed successfully');
    } catch (error) {
      logger.error('Notification check failed:', error);
    }
  });

  logger.info('Notification cron job scheduled');
};

module.exports = { scheduleNotifications };