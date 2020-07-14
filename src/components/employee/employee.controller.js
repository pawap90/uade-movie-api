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

/**
 * Delete employee
 */
module.exports.delete = async (req, res, next) => {
    try {
        await employeeService.delete(req.params.id);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Create remuneration by an employee id.
 */
module.exports.createRemunerationById = async (req, res, next) => {
    try {
        await employeeService.createRemunerationById(req.params.employeeId, req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Get all remunerations
 */
module.exports.getAllRemunerations = async (req, res, next) => {
    try {
        const remunerations = await employeeService.getAllRemunerations();

        return res.json(remunerations);
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Get all remunerations by an employee id
 */
module.exports.getRemunerationsByEmployeeId = async (req, res, next) => {
    try {
        const remunerations = await employeeService.getRemunerationsByEmployeeId(req.params.employeeId);

        return res.json(remunerations);
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Get a remuneration by an employee id and a remuneration id
 */
module.exports.getRemunerationByEmployeeIdAndRemunerationId = async (req, res, next) => {
    try {
        const { employeeId, remunerationId } = req.params;

        const remuneration = await employeeService.getRemunerationByEmployeeIdAndRemunerationId(employeeId, remunerationId);

        return res.json(remuneration);
    }
    catch (err) {
        return next(err);
    }
};
