const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { envConfig } = require('../../../config/env.config');
const { AppError } = require('../../../utils/appError');

let configuredPasswordHashPromise;

const getConfiguredPasswordHash = async () => {
  if (!envConfig.adminPassword) {
    throw new AppError('Admin credentials are not configured.', 500);
  }

  if (!configuredPasswordHashPromise) {
    configuredPasswordHashPromise = envConfig.adminPassword.startsWith('$2')
      ? Promise.resolve(envConfig.adminPassword)
      : bcrypt.hash(envConfig.adminPassword, 10);
  }

  return configuredPasswordHashPromise;
};

const validateAdminCredentials = async ({ username, password }) => {
  if (!envConfig.adminUsername || !envConfig.jwtSecret) {
    throw new AppError('Authentication environment variables are not configured.', 500);
  }

  const usernameMatches = username === envConfig.adminUsername;
  const configuredPasswordHash = await getConfiguredPasswordHash();
  const passwordMatches = await bcrypt.compare(password, configuredPasswordHash);

  if (!usernameMatches || !passwordMatches) {
    throw new AppError('Invalid credentials', 401);
  }

  return {
    username: envConfig.adminUsername
  };
};

const generateAdminToken = ({ username }) =>
  jwt.sign(
    {
      username
    },
    envConfig.jwtSecret,
    {
      expiresIn: '1d'
    }
  );

const loginAdmin = async ({ username, password }) => {
  const admin = await validateAdminCredentials({ username, password });
  const token = generateAdminToken(admin);

  return {
    token,
    admin
  };
};

module.exports = {
  loginAdmin,
  generateAdminToken
};
