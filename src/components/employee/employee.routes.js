'use strict';

const express = require('express');
const router = express.Router();

const employeeController = require('./employee.controller');

/**
 * Get all employees.
 */
router.get('/', employeeController.getAll);

/**
 * Get all remunerations.
 */
router.get('/remuneration', employeeController.getAllRemunerations);

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

/**
 * Delete employee.
 */
router.delete('/:id', employeeController.delete);

/**
 * Creates a remuneration by an employee id.
 */
router.post('/:employeeId/remuneration', employeeController.createRemunerationById);

/**
 * Get a remuneration by an employee id and a remuneration id
 */
router.post('/:employeeId/remuneration/:remunerationiId', employeeController.getRemunerationByEmployeeIdAndRemunerationId);

module.exports = router;