const mongoose = require('mongoose');
const { databaseConfig } = require('../config/database.config');
const { appLogger } = require('../utils/logger');

const connectDatabase = async () => {
  try {
    await mongoose.connect(databaseConfig.uri, databaseConfig.options);
    console.log(`MongoDB connected successfully: ${databaseConfig.uri}`);
    appLogger.info('MongoDB connected successfully.', { uri: databaseConfig.uri });
  } catch (error) {
    appLogger.error('MongoDB connection failed.', {
      error: error.message,
      uri: databaseConfig.uri
    });
    throw error;
  }
};

const disconnectDatabase = async (reason = 'application shutdown') => {
  await mongoose.connection.close();
  appLogger.info('MongoDB connection closed.', { reason });
};

module.exports = { connectDatabase, disconnectDatabase };
