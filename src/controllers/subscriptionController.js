const Subscription = require('../models/Subscription');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../middleware/errorHandler');

class SubscriptionController {
  async create(req, res, next) {
    try {
      const subscriptionData = {
        ...req.validatedData,
        user_id: req.userId,
        next_billing_date: this.calculateNextBillingDate(
          req.validatedData.start_date,
          req.validatedData.billing_cycle
        ),
      };

      const subscription = await Subscription.create(subscriptionData);

      return ResponseHandler.created(
        res,
        subscription,
        'Subscription created successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { status, category, page = 1, limit = 10 } = req.query;

      const where = { user_id: req.userId };
      if (status) where.status = status;
      if (category) where.category = category;

      const offset = (page - 1) * limit;

      const { count, rows } = await Subscription.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [['created_at', 'DESC']],
      });

      return ResponseHandler.success(res, {
        subscriptions: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const subscription = await Subscription.findOne({
        where: {
          id: req.params.id,
          user_id: req.userId,
        },
      });

      if (!subscription) {
        throw new AppError('Subscription not found', 404);
      }

      return ResponseHandler.success(res, subscription);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const subscription = await Subscription.findOne({
        where: {
          id: req.params.id,
          user_id: req.userId,
        },
      });

      if (!subscription) {
        throw new AppError('Subscription not found', 404);
      }

      const updateData = req.validatedData;
      
      // Recalculate next billing date if billing cycle or start date changed
      if (updateData.billing_cycle || updateData.start_date) {
        updateData.next_billing_date = this.calculateNextBillingDate(
          updateData.start_date || subscription.start_date,
          updateData.billing_cycle || subscription.billing_cycle
        );
      }

      await subscription.update(updateData);

      return ResponseHandler.success(
        res,
        subscription,
        'Subscription updated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const subscription = await Subscription.findOne({
        where: {
          id: req.params.id,
          user_id: req.userId,
        },
      });

      if (!subscription) {
        throw new AppError('Subscription not found', 404);
      }

      await subscription.destroy();

      return ResponseHandler.success(
        res,
        null,
        'Subscription deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  calculateNextBillingDate(startDate, billingCycle) {
    const date = new Date(startDate);
    const today = new Date();

    // If start date is in the future, return it
    if (date > today) {
      return date.toISOString().split('T')[0];
    }

    // Calculate next billing date based on cycle
    while (date <= today) {
      switch (billingCycle) {
        case 'daily':
          date.setDate(date.getDate() + 1);
          break;
        case 'weekly':
          date.setDate(date.getDate() + 7);
          break;
        case 'monthly':
          date.setMonth(date.getMonth() + 1);
          break;
        case 'quarterly':
          date.setMonth(date.getMonth() + 3);
          break;
        case 'yearly':
          date.setFullYear(date.getFullYear() + 1);
          break;
      }
    }

    return date.toISOString().split('T')[0];
  }
}

module.exports = new SubscriptionController();