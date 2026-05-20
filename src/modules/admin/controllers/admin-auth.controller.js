const adminAuthService = require('../services/admin-auth.service');
const { createHttpError } = require('../../../utils/httpError');

const login = async (req, res, next) => {
  try {
    const token = await adminAuthService.loginAdmin(req.body);

    if (!token) {
      return next(createHttpError(401, 'Invalid credentials'));
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { login };
