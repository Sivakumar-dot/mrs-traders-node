const { envConfig } = require('../../../config/env.config');
const { generateAdminToken } = require('../../../utils/jwt');

const loginAdmin = async ({ username, password }) => {
  const normalizedUsername = String(username).trim();
  const normalizedPassword = String(password).trim();

  if (
    normalizedUsername !== envConfig.adminUsername ||
    normalizedPassword !== envConfig.adminPassword
  ) {
    return null;
  }

  return generateAdminToken({ username: normalizedUsername });
};

module.exports = { loginAdmin };
