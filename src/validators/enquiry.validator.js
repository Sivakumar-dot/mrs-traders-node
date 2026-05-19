const { errorResponse } = require('../utils/responseHandler');

const validateEnquiry = (req, res, next) => {
  const { name, mobile, message } = req.body;
  const errors = {};

  if (!name || !String(name).trim()) {
    errors.name = 'Name is required.';
  }

  if (!mobile || !String(mobile).trim()) {
    errors.mobile = 'Mobile number is required.';
  } else {
    const sanitizedMobile = String(mobile).trim();
    if (!/^\d+$/.test(sanitizedMobile) || sanitizedMobile.length < 10) {
      errors.mobile = 'Mobile number must contain only digits and be at least 10 digits.';
    }
  }

  if (!message || !String(message).trim()) {
    errors.message = 'Message is required.';
  }

  if (Object.keys(errors).length > 0) {
    return errorResponse({
      res,
      statusCode: 400,
      message: 'Validation failed.',
      requestId: req.requestId,
      errors
    });
  }

  return next();
};

module.exports = { validateEnquiry };
