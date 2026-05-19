const authMiddleware = (req, res, next) => {
  const error = new Error('Authentication module is not configured yet.');
  error.statusCode = 501;
  next(error);
};

module.exports = { authMiddleware };
