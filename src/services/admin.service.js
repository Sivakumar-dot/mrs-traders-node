const { findActiveAdmins } = require('../repositories/admin.repository');

const getActiveAdmins = async () => findActiveAdmins();

module.exports = { getActiveAdmins };
