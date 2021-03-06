const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const accountController = require('./account.controller');

/**
 * Login user.
 */
router.post('/login', accountController.login);

/**
 * Register user account.
 */
router.post('/register', accountController.register);

/**
 * Change user's password.
 */
router.put('/change-password', authorize, accountController.changePassword);

/**
 * Get current user.
 */
router.get('/current-user', authorize, accountController.getCurrentUser);

/**
 * Update account data.
 */
router.put('/', authorize, accountController.updateAccount);

module.exports = router;