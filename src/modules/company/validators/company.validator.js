const { body } = require('express-validator');

const companyFields = [
  'companyName',
  'companyService',
  'ownerName',
  'address',
  'mobileNumber',
  'whatsappNumber',
  'email',
  'googleMapUrl',
  'businessHours'
];

const validateCompanySettings = companyFields.map((field) =>
  body(field)
    .optional({ nullable: false })
    .isString()
    .withMessage(`${field} must be a string.`)
    .bail()
    .trim()
);

validateCompanySettings.push(
  body('email')
    .optional()
    .custom((value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    .withMessage('email must be a valid email address.'),
  body('mobileNumber')
    .optional()
    .custom((value) => value === '' || /^[0-9+\-\s]{10,20}$/.test(value))
    .withMessage('mobileNumber must be a valid phone number.'),
  body('whatsappNumber')
    .optional()
    .custom((value) => value === '' || /^[0-9+\-\s]{10,20}$/.test(value))
    .withMessage('whatsappNumber must be a valid phone number.')
);

module.exports = { validateCompanySettings };
