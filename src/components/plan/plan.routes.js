'use strict';

const express = require('express');
const router = express.Router();

const planController = require('./plan.controller');

/**
 * Create plan
 */
router.post('/', planController.create);

/**
 * Delete a plan by id
 */
router.delete('/:id', planController.deleteById);

/**
 * Update a plan by id
 */
router.put('/:id', planController.updateById);

/**
 * Get all plans
 */
router.get('/', planController.getAllPlans);

module.exports = router;