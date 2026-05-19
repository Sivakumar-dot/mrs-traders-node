const adminAuthService = require('../services/admin-auth.service');
const { AppError } = require('../../../utils/appError');

const loginAdmin = async (req, res, next) => {
  try {
    const { token } = await adminAuthService.loginAdmin(req.body);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token
    });
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 401 && error.message === 'Invalid credentials') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    return next(error);
  }
};

module.exports = { loginAdmin };
