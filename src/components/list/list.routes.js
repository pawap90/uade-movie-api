const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const listController = require('./list.controller');

/**
 * Create new list.
 */
router.post('/', listController.postList);

module.exports = router;