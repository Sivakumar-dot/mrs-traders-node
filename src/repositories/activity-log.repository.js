const ActivityLog = require('../models/activity-log.model');

const createActivityLog = async (payload) => ActivityLog.create(payload);

module.exports = { createActivityLog };
