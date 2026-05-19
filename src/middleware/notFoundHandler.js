const { errorResponse } = require('../utils/responseHandler');

const notFoundHandler = (req, res) => {
  return errorResponse({
    res,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found.`,
    requestId: req.requestId
  });
};

module.exports = { notFoundHandler };
