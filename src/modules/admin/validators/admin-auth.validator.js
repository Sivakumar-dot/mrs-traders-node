const { body } = require('express-validator');

const loginAdminValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
];

module.exports = { loginAdminValidator };
