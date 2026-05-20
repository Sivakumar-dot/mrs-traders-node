const express = require('express');
const { login } = require('../controllers/admin-auth.controller');
const { validateAdminLogin } = require('../validators/admin.validator');
const { validateRequest } = require('../../../middleware/validateRequest');

const router = express.Router();

router.post('/login', validateAdminLogin, validateRequest, login);

module.exports = router;
