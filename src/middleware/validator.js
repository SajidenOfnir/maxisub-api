const { validationResult } = require('express-validator');
const ResponseHandler = require('../utils/responseHandler');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return ResponseHandler.error(
        res,
        'Validation failed',
        400,
        errors
      );
    }

    req.validatedData = value;
    next();
  };
};

module.exports = { validate };