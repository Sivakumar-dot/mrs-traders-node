const { validationResult } = require('express-validator');
const { AppError } = require('../utils/appError');

const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().reduce((formattedErrors, error) => {
    if (!formattedErrors[error.path]) {
      formattedErrors[error.path] = error.msg;
    }

    return formattedErrors;
  }, {});

  return next(new AppError('Validation failed', 400, errors));
};

module.exports = { validateRequest };
