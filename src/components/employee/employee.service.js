'use strict';

const error = require('throw.js');

const EmployeeModel = require('./employee.model');
const RemunerationModel = require('./remuneration.model');

/**
 * Get all employees.
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getAll = async () => {
    try {
        const employees = await EmployeeModel.find().select('employeeNumber persona.name persona.lastName phoneNumber persona.email');

        return employees;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error getting all employees');
        else throw err;
    }
};

/**
 * Get employee by id.
 * @param {String} id Employee identifier
 * @throws {BadRequest} When the employee id is not provided
 * @throws {NotFound} When the employee is not found
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getById = async (id) => {
    try {
        if (!id)
            throw new error.BadRequest('id not provided');

        const employee = await EmployeeModel.findById(id);

        if (!employee)
            throw new error.NotFound('Employee not found.');

        return employee;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error getting employee by id');
        else throw err;
    }
};

/**
 * Creates a new employee
 * @param {Object} employee Employee data
 * @throws {BadRequest} When the employee data is invalid or not provided
 * @throws {Conflict} When the email already exists in the db
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.create = async (employee) => {
    try {
        if (!employee)
            throw new error.BadRequest('employee data not provided');

        employee.email = employee.email ? employee.email.toLowerCase() : null;

        // Create an EmployeeModel instance to allow mongoose to validate the model.
        let newEmployee = new EmployeeModel();
        newEmployee = {
            employeeNumber: await generateEmployeeNumber(),
            phoneNumber: employee.phoneNumber,
            cuit: employee.cuit,
            jobTitle: employee.jobTitle,
            grossSalary: employee.grossSalary,
            entryDate: employee.entryDate
        };
        newEmployee.persona = {
            name: employee.name,
            lastName: employee.lastName,
            email: employee.email,
            address: employee.address,
            dateOfBirth: employee.dateOfBirth
        };

        await EmployeeModel.create(newEmployee);
    }
    catch (err) {
        if (err.name === 'MongoError' && err.code === 11000)
            throw new error.Conflict('Employee with the specified email already registered.');
        else if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid employee data.');
        else throw err;
    }
};

/**
 * Update employee by id.
 * @param {String} id Employee identifier
 * @param {Object} employee Employee data
 * @throws {BadRequest} When the employee data is invalid or not provided
 * @throws {Conflict} When the email already exists in the db
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.update = async (id, employee) => {
    try {
        if (!employee)
            throw new error.BadRequest('employee data not provided');

        employee.email = employee.email ? employee.email.toLowerCase() : null;

        await EmployeeModel.findByIdAndUpdate(id, {
            $set: {
                phoneNumber: employee.phoneNumber,
                cuit: employee.cuit,
                jobTitle: employee.jobTitle,
                grossSalary: employee.grossSalary,
                entryDate: employee.entryDate,
                persona: {
                    name: employee.name,
                    lastName: employee.lastName,
                    email: employee.email,
                    address: employee.address,
                    dateOfBirth: employee.dateOfBirth
                }
            }
        }, { runValidators: true });
    }
    catch (err) {
        if (err.name === 'MongoError' && err.code === 11000)
            throw new error.Conflict('Employee with the specified email already registered.');
        else if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid employee data.');
        else throw err;
    }
};

/**
 * Delete a single employee by id.
 * @param {String} id Employee identifier
 * @throws {BadRequest} When the employee id is not provided
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.delete = async (id) => {
    try {
        if (!id)
            throw new error.BadRequest('id not provided');
        await EmployeeModel.findByIdAndDelete(id);
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error deleting the employee');
        else throw err;
    }
};

/**
 * Generate a secuential number for a new employee based on the previously generated number.
 * E.g: E-0001
 */
const generateEmployeeNumber = async () => {
    let number = 1;
    const lastEmployee = await EmployeeModel.findOne().sort({ createDate: -1 });

    if (lastEmployee) {
        const lastNumber = parseInt(lastEmployee.employeeNumber.split('-')[1].replace('0', ''));
        number = lastNumber + 1;
    }

    const numberString = number.toString();
    const employeeNumber = 'E-' + numberString.padStart(5 - numberString.length, '0');

    return employeeNumber;
};

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