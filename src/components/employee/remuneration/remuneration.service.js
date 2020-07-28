'use strict';

const error = require('throw.js');

const RemunerationModel = require('./remuneration.model');
const remunerationDetails = require('./remuneration-details');
const employeeService = require('../employee.service');

/**
 * Creates a new remuneration by an employee id
 * @param {String} employeeId employee identifier
 * @param {Object} remuneration remuneration data
 * @throws {BadRequest} When the remuneration data is invalid or not provided
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.createRemunerationById = async (employeeId, remuneration) => {
    try {
        if (!employeeId || !remuneration || !remuneration.details)
            throw new error.BadRequest('employeeId or remuneration data not provided');

        const total = remuneration.details.reduce((acc, det) => {
            return det.value + acc;
        }, 0);

        let newRemuneration = new RemunerationModel();
        newRemuneration = {
            employee: employeeId,
            date: remuneration.date,
            details: remuneration.details,
            total: total
        };

        await RemunerationModel.create(newRemuneration);
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid remuneration data or employeeId.');
        else if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        else throw err;
    }
};

/**
 * Generate a remuneration preview for the specified employee.
 * @param {String} employeeId Employe identifier
 */
module.exports.previewRemuneration = async (employeeId) => {
    try {
        if (!employeeId)
            throw new error.BadRequest('employeeId not provided');

        const employee = await employeeService.getById(employeeId);

        let newRemuneration = new RemunerationModel();
        const remunerationDate = new Date();
        newRemuneration = {
            employee: employeeId,
            date: remunerationDate
        };
        
        remuneration.details = remunerationDetails.calculate(employee);
        newRemuneration.total = remuneration.details.reduce((acc, det) => {
            return det.value + acc;
        }, 0);

        return newRemuneration;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        else throw err;
    }
}

/**
 * Get all remunerations.
 * @param {String} dateStart Retrieve remunerations created before this date. String date format yyyy/MM/dd
 * @param {String} dateEnd Retrieve remunerations created after this date. String date format yyyy/MM/dd
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getAllRemunerations = async (dateStart, dateEnd) => {
    try {
        if ((dateStart && !dateEnd) || (dateEnd && !dateStart))
            throw new error.BadRequest('When using the date filter please provide both dates');

        let filter = {};

        if (dateStart && dateEnd) {
            // Parse strings to Date.
            const auxDateStart = new Date(dateStart);
            const auxDateEnd = new Date(dateEnd);

            // Set time include the whole day.
            auxDateStart.setHours(0, 0, 0, 0);
            auxDateEnd.setHours(23, 59, 59, 999);

            // Date range filter.
            filter = { date: { $gte: auxDateStart, $lte: auxDateEnd } };
        }

        // Execute query.
        const remunerations = await RemunerationModel.find(filter)
            .select('date total employee')
            .sort({ date: -1 })
            .populate('employee', 'employeeNumber persona.name persona.lastName');

        return remunerations;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error getting all remunerations');
        else throw err;
    }
};

/**
 * Get all remunerations by an employee by id.
 * @param {String} employeeId Employee identifier.
 * @throws {BadRequest} When the employee id is not provided
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getRemunerationsByEmployeeId = async (employeeId) => {
    try {
        if (!employeeId)
            throw new error.BadRequest('employee id not provided');

        const remunerations = await RemunerationModel.find({ employee: employeeId })
            .select('date total employee')
            .sort({ date: -1 })
            .populate('employee', 'employeeNumber persona.name persona.lastName');

        return remunerations;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error getting remunerations for an employee');
        else throw err;
    }
};

/**
 * Get a remuneration by an employee id and a remuneration id.
 * @param {String} employeeId employee identifier
 * @param {String} remunerationId remuneration identifier
 * @throws {BadRequest} The employee identifier or remuneration identifier were not provided
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getRemunerationByEmployeeIdAndRemunerationId = async (employeeId, remunerationId) => {
    try {
        if (!employeeId || !remunerationId)
            throw new error.BadRequest('employeeId or remunerationId were not provided');

        const remuneration = await RemunerationModel.find({ employee: employeeId, _id: remunerationId })
            .populate('employee');

        return remuneration;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error getting the remuneration');
        else throw err;
    }
};