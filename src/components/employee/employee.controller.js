'use strict';

const employeeService = require('./employee.service');

/**
 * Get all employees
 */
module.exports.getAll = async (req, res, next) => {
    try {
        const employees = await employeeService.getAll();

        return res.json(employees);
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Get employee by id.
 */
module.exports.getById = async (req, res, next) => {
    try {
        const employee = await employeeService.getById(req.params.id);

        return res.json(employee);
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Create employee.
 */
module.exports.create = async (req, res, next) => {
    try {
        await employeeService.create(req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Update employee.
 */
module.exports.update = async (req, res, next) => {
    try {
        await employeeService.update(req.params.id, req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};