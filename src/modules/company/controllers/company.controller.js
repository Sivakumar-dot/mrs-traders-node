const companyService = require('../services/company.service');
const { successResponse } = require('../../../utils/responseHandler');

const getCompanySettings = async (req, res, next) => {
  try {
    const companySettings = await companyService.getCompanySettings();

    return successResponse({
      res,
      message: 'Company settings fetched successfully.',
      requestId: req.requestId,
      data: companySettings
    });
  } catch (error) {
    return next(error);
  }
};

const updateCompanySettings = async (req, res, next) => {
  try {
    const companySettings = await companyService.updateCompanySettings(req.body);

    return successResponse({
      res,
      message: 'Company settings updated successfully.',
      requestId: req.requestId,
      data: companySettings
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCompanySettings,
  updateCompanySettings
};
