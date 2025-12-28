const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/analyticsController');
const auth = require('../../middleware/auth');

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get analytics dashboard
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', auth, analyticsController.getDashboard);

/**
 * @swagger
 * /analytics/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: is_read
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/notifications', auth, analyticsController.getNotifications);

/**
 * @swagger
 * /analytics/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized
 */
router.put('/notifications/:id/read', auth, analyticsController.markNotificationAsRead);

module.exports = router;