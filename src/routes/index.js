const express = require('express');
const router = express.Router();
const authRoutes = require('./v1/auth');
const subscriptionRoutes = require('./v1/subscriptions');
const analyticsRoutes = require('./v1/analytics');
const webhookRoutes = require('./v1/webhooks');

// API v1 routes
router.use('/auth', authRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/webhooks', webhookRoutes);

module.exports = router;