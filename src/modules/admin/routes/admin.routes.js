const express = require('express');
const { loginAdmin } = require('../controllers/admin-auth.controller');
const { loginAdminValidator } = require('../validators/admin-auth.validator');
const { validateRequest } = require('../../../middleware/validateRequest');

const router = express.Router();

router.post('/login', loginAdminValidator, validateRequest, loginAdmin);

module.exports = router;
