const mongoose = require('mongoose');
const { getWhatsAppState } = require('../config/whatsapp.config');
const { successResponse } = require('../utils/responseHandler');
const { logActivity } = require('../services/activity-log.service');
const { APP_CONSTANTS } = require('../utils/constants');

const getHealth = async (req, res, next) => {
  try {
    const payload = {
      status: 'OK',
      database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
      whatsapp: getWhatsAppState(),
      uptime: process.uptime()
    };

    await logActivity({
      type: APP_CONSTANTS.ACTIVITY_TYPES.HEALTH_CHECK,
      message: 'Health check endpoint accessed.',
      requestId: req.requestId
    });

    return successResponse({
      res,
      message: 'Service health fetched successfully.',
      requestId: req.requestId,
      data: payload
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getHealth };
