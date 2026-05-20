const jwt = require('jsonwebtoken');
const { envConfig } = require('../config/env.config');

const generateAdminToken = (payload) =>
  jwt.sign(payload, envConfig.jwtSecret, { expiresIn: envConfig.jwtExpiresIn });

const verifyAdminToken = (token) => jwt.verify(token, envConfig.jwtSecret);

module.exports = { generateAdminToken, verifyAdminToken };
