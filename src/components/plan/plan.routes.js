'use strict';

const express = require('express');
const router = express.Router();

const planController = require('./plan.controller');

/**
 * Create plan
 */
router.post('/', planController.create);

module.exports = router;