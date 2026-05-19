const { envConfig } = require('./env.config');

const databaseConfig = {
  uri: envConfig.mongodbUri,
  options: {
    autoIndex: envConfig.nodeEnv !== 'production',
    serverSelectionTimeoutMS: 10000
  }
};

module.exports = { databaseConfig };
