const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const ResponseHandler = require('../utils/responseHandler');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return ResponseHandler.error(
        res,
        'No authentication token provided',
        401
      );
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.is_active) {
      return ResponseHandler.error(
        res,
        'Invalid authentication token',
        401
      );
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    return ResponseHandler.error(
      res,
      'Authentication failed',
      401
    );
  }
};

module.exports = auth;