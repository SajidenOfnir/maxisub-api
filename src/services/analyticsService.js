const Subscription = require('../models/Subscription');
const { Op, fn, col } = require('sequelize');

class AnalyticsService {
  async getUserAnalytics(userId) {
    const subscriptions = await Subscription.findAll({
      where: { user_id: userId },
      attributes: ['status', 'amount', 'currency', 'billing_cycle', 'category'],
    });

    const totalActive = subscriptions.filter(s => s.status === 'active').length;
    const totalCancelled = subscriptions.filter(s => s.status === 'cancelled').length;

    // Calculate total monthly cost
    let monthlyTotal = 0;
    subscriptions.forEach(sub => {
      if (sub.status === 'active') {
        const amount = parseFloat(sub.amount);
        switch (sub.billing_cycle) {
          case 'daily':
            monthlyTotal += amount * 30;
            break;
          case 'weekly':
            monthlyTotal += amount * 4;
            break;
          case 'monthly':
            monthlyTotal += amount;
            break;
          case 'quarterly':
            monthlyTotal += amount / 3;
            break;
          case 'yearly':
            monthlyTotal += amount / 12;
            break;
        }
      }
    });

    // Group by category
    const byCategory = subscriptions.reduce((acc, sub) => {
      const category = sub.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { count: 0, total: 0 };
      }
      acc[category].count++;
      acc[category].total += parseFloat(sub.amount);
      return acc;
    }, {});

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: totalActive,
      cancelledSubscriptions: totalCancelled,
      estimatedMonthlyCost: monthlyTotal.toFixed(2),
      byCategory,
      byBillingCycle: this.groupByBillingCycle(subscriptions),
    };
  }

  groupByBillingCycle(subscriptions) {
    return subscriptions.reduce((acc, sub) => {
      if (!acc[sub.billing_cycle]) {
        acc[sub.billing_cycle] = 0;
      }
      acc[sub.billing_cycle]++;
      return acc;
    }, {});
  }

  async getUpcomingRenewals(userId, days = 30) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    return await Subscription.findAll({
      where: {
        user_id: userId,
        status: 'active',
        next_billing_date: {
          [Op.lte]: targetDate.toISOString().split('T')[0],
          [Op.gte]: new Date().toISOString().split('T')[0],
        },
      },
      order: [['next_billing_date', 'ASC']],
    });
  }
}

module.exports = new AnalyticsService();