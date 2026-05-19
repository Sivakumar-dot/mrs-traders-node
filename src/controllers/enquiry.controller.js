const enquiryService = require('../services/enquiry.service');
const { successResponse } = require('../utils/responseHandler');

const submitEnquiry = async (req, res, next) => {
  try {
    const result = await enquiryService.createEnquiry({
      body: req.body,
      requestId: req.requestId,
      ipAddress: req.ip
    });

    return successResponse({
      res,
      statusCode: 201,
      message: 'Enquiry submitted successfully.',
      requestId: req.requestId,
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { submitEnquiry };
