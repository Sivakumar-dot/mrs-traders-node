const { validationResult } = require('express-validator');
const { createHttpError } = require('../utils/httpError');

const validateRequest = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    return next();
  }

  const formattedErrors = validationErrors.array().reduce((errors, issue) => {
    if (!errors[issue.path]) {
      errors[issue.path] = issue.msg;
    }

    return errors;
  }, {});

  return next(createHttpError(400, 'Validation failed.', formattedErrors));
};

module.exports = { validateRequest };
