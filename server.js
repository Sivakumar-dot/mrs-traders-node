const { createApp } = require('./src/app');
const { connectDatabase, disconnectDatabase } = require('./src/database/connection');
const { envConfig } = require('./src/config/env.config');
const { initializeWhatsAppClient, destroyWhatsAppClient } = require('./src/config/whatsapp.config');
const { appLogger } = require('./src/utils/logger');

const startServer = async () => {
  try {
    await connectDatabase();
    await initializeWhatsAppClient();

    const app = createApp();
    const server = app.listen(envConfig.port, () => {
      appLogger.info(`Server running on port ${envConfig.port}`, {
        environment: envConfig.nodeEnv
      });
    });

    const gracefulShutdown = async (signal) => {
      appLogger.info(`Received ${signal}. Starting graceful shutdown.`);

      server.close(async () => {
        try {
          await destroyWhatsAppClient();
          await disconnectDatabase(signal);
          appLogger.info('Graceful shutdown completed.');
          process.exit(0);
        } catch (error) {
          appLogger.error('Error during graceful shutdown.', { error: error.message });
          process.exit(1);
        }
      });
    };

    ['SIGINT', 'SIGTERM'].forEach((signal) => {
      process.on(signal, () => gracefulShutdown(signal));
    });
  } catch (error) {
    appLogger.error('Application startup failed.', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

startServer();
