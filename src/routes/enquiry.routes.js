const express = require('express');
const { submitEnquiry } = require('../controllers/enquiry.controller');
const { validateEnquiry } = require('../validators/enquiry.validator');
const { enquiryRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/', enquiryRateLimiter, validateEnquiry, submitEnquiry);

module.exports = router;
