const express = require('express');
const cors = require('cors');
const { configureApp } = require('./config/app.config');
const enquiryRoutes = require('./routes/enquiry.routes');
const adminRoutes = require('./routes/admin.routes');
const companyRoutes = require('./routes/company.routes');
const healthRoutes = require('./routes/health.routes');
const { envConfig } = require('./config/env.config');
const { requestLogger } = require('./middleware/requestLogger');
const { notFoundHandler } = require('./middleware/notFoundHandler');
const { errorHandler } = require('./middleware/errorHandler');
const { createHttpError } = require('./utils/httpError');

const createApp = () => {
  const app = express();

  configureApp(app);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || origin === envConfig.frontendUrl) {
          return callback(null, true);
        }

        return callback(createHttpError(403, 'CORS origin not allowed.'));
      }
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.use('/api/enquiry', enquiryRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/company', companyRoutes);
  app.use('/api/health', healthRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

module.exports = { createApp };
