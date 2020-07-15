'use strict';

const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const planController = require('./plan.controller');

/**
 * Create plan
 */
router.post('/', authorize, planController.create);

/**
 * Delete a plan by id
 */
router.delete('/:id', authorize, planController.deleteById);

/**
 * Update a plan by id
 */
router.put('/:id', authorize, planController.updateById);

/**
 * Get all plans
 */
router.get('/', authorize, planController.getAllPlans);

module.exports = router;