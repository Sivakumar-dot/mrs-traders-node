const express = require('express');
const { listAdmins } = require('../controllers/admin.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, listAdmins);

module.exports = router;
