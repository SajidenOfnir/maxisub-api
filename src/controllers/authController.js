const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../middleware/errorHandler');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, first_name, last_name } = req.validatedData;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }

      const user = await User.create({
        email,
        password,
        first_name,
        last_name,
      });

      const token = jwt.sign(
        { userId: user.id },
        config.jwt.secret,
        { expiresIn: config.jwt.expire }
      );

      return ResponseHandler.created(res, {
        user,
        token,
      }, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.validatedData;

      const user = await User.findOne({ where: { email } });
      if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid credentials', 401);
      }

      if (!user.is_active) {
        throw new AppError('Account is deactivated', 403);
      }

      const token = jwt.sign(
        { userId: user.id },
        config.jwt.secret,
        { expiresIn: config.jwt.expire }
      );

      return ResponseHandler.success(res, {
        user,
        token,
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      return ResponseHandler.success(res, req.user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { first_name, last_name } = req.body;

      req.user.first_name = first_name || req.user.first_name;
      req.user.last_name = last_name || req.user.last_name;
      await req.user.save();

      return ResponseHandler.success(res, req.user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();