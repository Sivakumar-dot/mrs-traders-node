const { APP_CONSTANTS } = require('./constants');

const formatDateTime = (date = new Date()) =>
  new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: APP_CONSTANTS.DEFAULT_TIMEZONE
  }).format(date);

module.exports = { formatDateTime };
