const Admin = require('../models/admin.model');

const findActiveAdmins = async () => Admin.find({ isActive: true }).lean();

module.exports = { findActiveAdmins };
