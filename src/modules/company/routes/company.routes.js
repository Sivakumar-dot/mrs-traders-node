const express = require('express');
const { getCompanySettings, updateCompanySettings } = require('../controllers/company.controller');
const { companySettingsValidator } = require('../validators/company.validator');
const { authMiddleware } = require('../../admin/middleware/auth.middleware');
const { validateRequest } = require('../../../middleware/validateRequest');

const router = express.Router();

router.get('/', authMiddleware, getCompanySettings);
router.put('/', authMiddleware, companySettingsValidator, validateRequest, updateCompanySettings);

module.exports = router;
