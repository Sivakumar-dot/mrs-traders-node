const successResponse = ({ res, statusCode = 200, message, data, requestId }) => {
  return res.status(statusCode).json({
    success: true,
    message,
    requestId,
    data
  });
};

const errorResponse = ({ res, statusCode = 500, message, errors, requestId }) => {
  return res.status(statusCode).json({
    success: false,
    message,
    requestId,
    errors
  });
};

module.exports = { successResponse, errorResponse };
