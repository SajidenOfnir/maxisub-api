const Joi = require('joi');

const subscriptionSchema = Joi.object({
  name: Joi.string().required().min(3).max(255),
  description: Joi.string().allow('', null),
  amount: Joi.number().required().positive(),
  currency: Joi.string().length(3).default('USD'),
  billing_cycle: Joi.string()
    .valid('daily', 'weekly', 'monthly', 'quarterly', 'yearly')
    .required(),
  start_date: Joi.date().required(),
  payment_method: Joi.string().allow('', null),
  category: Joi.string().allow('', null),
  reminder_enabled: Joi.boolean().default(true),
});

const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  subscriptionSchema,
  userRegistrationSchema,
  userLoginSchema,
};