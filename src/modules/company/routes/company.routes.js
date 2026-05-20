const express = require('express');
const { authMiddleware } = require('../../../middleware/auth.middleware');
const { validateRequest } = require('../../../middleware/validateRequest');
const { getCompanySettings, updateCompanySettings } = require('../controllers/company.controller');
const { validateCompanySettings } = require('../validators/company.validator');

const router = express.Router();

router.get('/', authMiddleware, getCompanySettings);
router.put('/', authMiddleware, validateCompanySettings, validateRequest, updateCompanySettings);

module.exports = router;
