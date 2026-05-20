const { body } = require('express-validator');

const validateAdminLogin = [
  body('username')
    .exists({ checkFalsy: true })
    .withMessage('Username is required.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Username is required.'),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Password is required.')
];

module.exports = { validateAdminLogin };
