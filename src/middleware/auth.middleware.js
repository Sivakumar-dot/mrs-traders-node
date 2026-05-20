const { verifyAdminToken } = require('../utils/jwt');
const { createHttpError } = require('../utils/httpError');

const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return next(createHttpError(401, 'Authorization token is required.'));
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return next(createHttpError(401, 'Authorization header must use Bearer token format.'));
    }

    const decodedUser = verifyAdminToken(token);
    req.user = decodedUser;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Token has expired.'));
    }

    if (error.name === 'JsonWebTokenError') {
      return next(createHttpError(401, 'Invalid token.'));
    }

    return next(error);
  }
};

module.exports = { authMiddleware };
