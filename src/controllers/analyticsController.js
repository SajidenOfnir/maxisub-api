const analyticsService = require('../services/analyticsService');
const notificationService = require('../services/notificationService');
const ResponseHandler = require('../utils/responseHandler');

class AnalyticsController {
  async getDashboard(req, res, next) {
    try {
      const analytics = await analyticsService.getUserAnalytics(req.userId);
      const upcomingRenewals = await analyticsService.getUpcomingRenewals(req.userId, 30);
      const unreadNotifications = await notificationService.getUserNotifications(req.userId, false);

      return ResponseHandler.success(res, {
        analytics,
        upcomingRenewals,
        unreadNotificationsCount: unreadNotifications.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async getNotifications(req, res, next) {
    try {
      const { is_read } = req.query;
      const isRead = is_read === 'true' ? true : is_read === 'false' ? false : null;

      const notifications = await notificationService.getUserNotifications(
        req.userId,
        isRead
      );

      return ResponseHandler.success(res, notifications);
    } catch (error) {
      next(error);
    }
  }

  async markNotificationAsRead(req, res, next) {
    try {
      const notification = await notificationService.markAsRead(
        req.params.id,
        req.userId
      );

      if (!notification) {
        return ResponseHandler.error(res, 'Notification not found', 404);
      }

      return ResponseHandler.success(res, notification, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();