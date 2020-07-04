'use strict';

const express = require('express');
const router = express.Router();

const employeeController = require('./employee.controller');

/**
 * Get employee by id.
 */
router.get('/:id', employeeController.getById);

/**
 * Create employee.
 */
router.post('/', employeeController.create);

/**
 * Update employee.
 */
router.put('/:id', employeeController.update);

module.exports = router;