'use strict';

const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const employeeController = require('./employee.controller');

/**
 * Get all employees.
 */
router.get('/', authorize, employeeController.getAll);

/**
 * Get all remunerations.
 */
router.get('/remuneration', authorize, employeeController.getAllRemunerations);

/**
 * Get employee by id.
 */
router.get('/:id', authorize, employeeController.getById);

/**
 * Create employee.
 */
router.post('/', authorize, employeeController.create);

/**
 * Update employee.
 */
router.put('/:id', authorize, employeeController.update);

/**
 * Delete employee.
 */
router.delete('/:id', authorize, employeeController.delete);

/**
 * Get a remuneration preview by employee id.
 */
router.get('/:employeeId/remuneration/preview', authorize, employeeController.previewRemuneration);

/**
 * Creates a remuneration by an employee id.
 */
router.post('/:employeeId/remuneration', authorize, employeeController.createRemunerationById);

/**
 * Get a remuneration by an employee id and a remuneration id
 */
router.get('/:employeeId/remuneration/:remunerationId', authorize, employeeController.getRemunerationByEmployeeIdAndRemunerationId);

/**
 * Gets remunerations by an employee id.
 */
router.get('/:employeeId/remuneration', authorize, employeeController.getRemunerationsByEmployeeId);

module.exports = router;