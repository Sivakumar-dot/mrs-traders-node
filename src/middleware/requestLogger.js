const { appLogger } = require('../utils/logger');
const { generateUuid } = require('../utils/idGenerator');
const { APP_CONSTANTS } = require('../utils/constants');
const { logActivity } = require('../services/activity-log.service');

const requestLogger = async (req, res, next) => {
  req.requestId = req.headers[APP_CONSTANTS.REQUEST_ID_HEADER] || generateUuid();
  res.setHeader(APP_CONSTANTS.REQUEST_ID_HEADER, req.requestId);

  const metadata = {
    method: req.method,
    endpoint: req.originalUrl,
    requestId: req.requestId,
    ipAddress: req.ip
  };

  appLogger.request('Incoming request received.', metadata);

  logActivity({
    type: APP_CONSTANTS.ACTIVITY_TYPES.REQUEST,
    message: `${req.method} ${req.originalUrl}`,
    requestId: req.requestId
  }).catch((error) => {
    appLogger.error('Failed to persist request activity log.', {
      requestId: req.requestId,
      error: error.message
    });
  });

  next();
};

module.exports = { requestLogger };
