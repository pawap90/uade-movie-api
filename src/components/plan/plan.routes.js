'use strict';

const express = require('express');
const router = express.Router();

const planController = require('./plan.controller');

/**
 * Create plan
 */
router.post('/', planController.create);

/**
 * Update a plan by id
 */
router.put('/:id', planController.updateById);

module.exports = router;