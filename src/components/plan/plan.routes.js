'use strict';

const express = require('express');
const router = express.Router();

const planController = require('./plan.controller');

/**
 * Create plan
 */
router.post('/', planController.create);

/**
 * Get all plans
 */
router.get('/', planController.getAllPlans);

module.exports = router;