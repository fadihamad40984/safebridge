const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

/**
 * Middleware to verify JWT Token
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Get user from database
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

/**
 * Middleware to check user permissions
 * @param  {...any} roles - Allowed roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

/**
 * Middleware to verify user is a child
 */
exports.childOnly = (req, res, next) => {
  if (req.user.role !== 'child') {
    return res.status(403).json({
      success: false,
      message: 'This action is only available for children',
    });
  }
  next();
};

/**
 * Middleware to verify user is a parent
 */
exports.parentOnly = (req, res, next) => {
  if (req.user.role !== 'parent') {
    return res.status(403).json({
      success: false,
      message: 'This action is only available for parents',
    });
  }
  next();
};
