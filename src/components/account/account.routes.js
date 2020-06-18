const express = require('express');
const router = express.Router();

const accountController = require('./account.controller');

/**
 * Login user.
 */
router.post('/login', accountController.login);

module.exports = router;