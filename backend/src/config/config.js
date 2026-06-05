module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // App configuration
  app: {
    name: 'SafeBridge',
    version: '1.0.0',
  },
  
  // Mood settings
  mood: {
    min: 1,
    max: 5,
    alertThreshold: 2, // Alert if mood is less than or equal to 2
    alertCount: 3, // Number of times to trigger alert
    alertDays: 7, // Within how many days
  },
};
