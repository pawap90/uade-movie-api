'use strict';

const express = require('express');
const router = express.Router();

const employeeController = require('./employee.controller');

/**
 * Create employee.
 */
router.post('/', employeeController.create);


module.exports = router;