const rateLimit = require('express-rate-limit');
const { envConfig } = require('../config/env.config');

const enquiryRateLimiter = rateLimit({
  windowMs: envConfig.rateLimitWindowMs,
  max: envConfig.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  }
});

module.exports = { enquiryRateLimiter };
