const companyService = require('../services/company.service');
const { successResponse } = require('../../../utils/responseHandler');

const getCompanySettings = async (req, res, next) => {
  try {
    const settings = await companyService.getCompanySettings();

    return successResponse({
      res,
      message: 'Company settings fetched successfully.',
      requestId: req.requestId,
      data: settings
    });
  } catch (error) {
    return next(error);
  }
};

const getPublicCompanySettings = async (req, res, next) => {
  try {
    const settings = await companyService.getCompanySettings();

    return successResponse({
      res,
      message: 'Company details fetched successfully.',
      requestId: req.requestId,
      data: settings
    });
  } catch (error) {
    return next(error);
  }
};

const updateCompanySettings = async (req, res, next) => {
  try {
    const settings = await companyService.updateCompanySettings(req.body);

    return successResponse({
      res,
      message: 'Company settings updated successfully.',
      requestId: req.requestId,
      data: settings
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getCompanySettings, getPublicCompanySettings, updateCompanySettings };
