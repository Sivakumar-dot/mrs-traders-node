const adminService = require('../services/admin.service');
const { successResponse } = require('../utils/responseHandler');

const listAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.getActiveAdmins();

    return successResponse({
      res,
      message: 'Active admins fetched successfully.',
      requestId: req.requestId,
      data: admins
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listAdmins };
