const { createActivityLog } = require('../repositories/activity-log.repository');
const { generateReadableId } = require('../utils/idGenerator');
const { APP_CONSTANTS } = require('../utils/constants');

const logActivity = async ({ type, message, requestId = null }) => {
  return createActivityLog({
    activityId: generateReadableId(APP_CONSTANTS.ACTIVITY_PREFIX),
    type,
    message,
    requestId
  });
};

module.exports = { logActivity };
