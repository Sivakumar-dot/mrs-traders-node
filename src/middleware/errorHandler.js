const { appLogger } = require('../utils/logger');
const { errorResponse } = require('../utils/responseHandler');
const { logActivity } = require('../services/activity-log.service');
const { APP_CONSTANTS } = require('../utils/constants');

const errorHandler = async (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  appLogger.error(message, {
    requestId: req.requestId,
    statusCode,
    stack: error.stack,
    endpoint: req.originalUrl
  });

  try {
    await logActivity({
      type: APP_CONSTANTS.ACTIVITY_TYPES.ERROR,
      message,
      requestId: req.requestId
    });
  } catch (activityError) {
    appLogger.error('Failed to write error activity log.', {
      requestId: req.requestId,
      error: activityError.message
    });
  }

  return errorResponse({
    res,
    statusCode,
    message,
    requestId: req.requestId,
    errors: error.errors || null
  });
};

module.exports = { errorHandler };
