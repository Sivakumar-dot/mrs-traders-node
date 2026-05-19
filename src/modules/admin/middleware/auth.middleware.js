const jwt = require('jsonwebtoken');
const { envConfig } = require('../../../config/env.config');
const { AppError } = require('../../../utils/appError');

const authMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization || '';

  if (!authorizationHeader.startsWith('Bearer ')) {
    return next(new AppError('Authorization token is required.', 401));
  }

  const token = authorizationHeader.slice(7).trim();

  if (!token) {
    return next(new AppError('Authorization token is required.', 401));
  }

  if (!envConfig.jwtSecret) {
    return next(new AppError('JWT secret is not configured.', 500));
  }

  try {
    const payload = jwt.verify(token, envConfig.jwtSecret);
    req.admin = {
      username: payload.username
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired.', 401));
    }

    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid authentication token.', 401));
    }

    return next(error);
  }
};

module.exports = { authMiddleware };
