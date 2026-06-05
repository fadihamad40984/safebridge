const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate JWT Token
 * @param {String} id - User ID
 * @returns {String} - JWT Token
 */
exports.generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

/**
 * Generate random parent code
 * @returns {String} - 8-character code
 */
exports.generateParentCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
};

/**
 * Send success response with Token
 * @param {Object} user - User object
 * @param {Number} statusCode - Status code
 * @param {Object} res - Response object
 */
exports.sendTokenResponse = (user, statusCode, res) => {
  const token = this.generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      parentCode: user.parentCode,
      linkedChild: user.linkedChild,
    },
  });
};
