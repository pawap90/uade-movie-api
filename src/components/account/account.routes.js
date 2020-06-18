const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const accountController = require('./account.controller');

/**
 * Login user.
 */
router.post('/login', accountController.login);

/**
 * Get current user.
 */
router.get('/current-user', authorize, accountController.getCurrentUser);

module.exports = router;