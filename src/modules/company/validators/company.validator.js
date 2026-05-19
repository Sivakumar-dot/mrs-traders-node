const { body } = require('express-validator');

const phoneNumberRegex = /^\d{10,15}$/;

const companySettingsValidator = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required.'),
  body('ownerName')
    .trim()
    .notEmpty()
    .withMessage('Owner name is required.'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required.'),
  body('mobileNumber')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required.')
    .bail()
    .matches(phoneNumberRegex)
    .withMessage('Mobile number must contain 10 to 15 digits.'),
  body('whatsappNumber')
    .trim()
    .notEmpty()
    .withMessage('WhatsApp number is required.')
    .bail()
    .matches(phoneNumberRegex)
    .withMessage('WhatsApp number must contain 10 to 15 digits.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .bail()
    .isEmail()
    .withMessage('A valid email address is required.'),
  body('mapUrl')
    .trim()
    .notEmpty()
    .withMessage('Map URL is required.')
    .bail()
    .isURL({
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .withMessage('A valid map URL is required.'),
  body('businessHours')
    .trim()
    .notEmpty()
    .withMessage('Business hours are required.')
];

module.exports = { companySettingsValidator };
