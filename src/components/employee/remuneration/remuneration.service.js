'use strict';

const error = require('throw.js');

const RemunerationModel = require('./remuneration.model');
const remunerationDetails = require('./remuneration-details');
const employeeService = require('../employee.service');
const LegalData = require('../../../gym-legal-data');

const iabankService = require('../../../external-services/iabank.service');

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

        const newRemuneration = await this.previewRemuneration(employeeId);

        if (remuneration.details.length > 0) {
            newRemuneration.details = remunerationDetails.combine(newRemuneration.details, remuneration.details);
            newRemuneration.total = remunerationDetails.sumSubtotals(newRemuneration.details);
        }

        const employee = await employeeService.getById(employeeId);
        await createTransfer(employee.dni, newRemuneration.total);

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

        const employee = await (await employeeService.getById(employeeId)).populate('employee', 'jobTitle employeeNumber cuit entryDate persona.name persona.lastName');

        let newRemuneration = new RemunerationModel();

        // Get the previous month
        let remunerationDate = new Date();
        remunerationDate = remunerationDate.setMonth(remunerationDate.getMonth() - 1);

        const remunerationMonthName = remunerationDate.toLocaleString('es-AR', { month: 'long' });
        const remunerationYear = employee.entryDate.getFullYear();

        newRemuneration = {
            date: new Date(),
            paymentPeriod: `${remunerationMonthName} ${remunerationYear}`
        };

        const seniority = Math.floor(Math.abs(remunerationDate - employee.entryDate) / (1000 * 60 * 60 * 24 * 365));

        newRemuneration.employeeData = {
            employeeId: employeeId,
            jobTitle: employee.jobTitle,
            fullName: `${employee.persona.name} ${employee.persona.lastName}`,
            employeeNumber: employee.employeeNumber,
            cuit: employee.cuit,
            entryDate: employee.entryDate,
            seniority: seniority
        };

        newRemuneration.details = remunerationDetails.calculate(employee, remunerationDate);
        newRemuneration.total = remunerationDetails.sumSubtotals(newRemuneration.details);

        newRemuneration.legalData = LegalData.legalData;

        return newRemuneration;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        throw err;
    }
};

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

/**
 * Create bank transfer
 * @param {String} employeeDni Employee dni
 * @param {Number} amount Transfer amount
 */
const createTransfer = async (employeeDni, amount) => {
    const client = await iabankService.getClient(employeeDni);

    const account = await iabankService.getClientSavingsAccount(client.id);

    await iabankService.createTransfer(account.id, amount, 'Liquidación de sueldo');
};