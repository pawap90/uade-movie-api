'use strict';

const employeeService = require('./employee.service');

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