const { envConfig } = require('./env.config');
const { APP_CONSTANTS } = require('../utils/constants');

const configureApp = (app) => {
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.locals.appName = APP_CONSTANTS.APP_NAME;
  app.locals.environment = envConfig.nodeEnv;
};

module.exports = { configureApp };
