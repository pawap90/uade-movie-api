'use strict';

const error = require('throw.js');
const moment = require('moment');

const EmployeeModel = require('./employee.model');

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

        if (!validateDates(employee.vacationStartDate, employee.vacationEndDate) && employee.vacationStartDate && employee.vacationEndDate)
            throw new error.BadRequest('vacation dates are invalid');

        employee.email = employee.email ? employee.email.toLowerCase() : null;

        // Create an EmployeeModel instance to allow mongoose to validate the model.
        let newEmployee = new EmployeeModel();
        newEmployee = {
            employeeNumber: await generateEmployeeNumber(),
            phoneNumber: employee.phoneNumber,
            cuit: employee.cuit,
            jobTitle: employee.jobTitle && employee.jobTitle.length > 0 ? employee.jobTitle[0] : null,
            grossSalary: employee.grossSalary,
            entryDate: employee.entryDate,
            isUnionMember: employee.isUnionMember,
            dni: employee.dni,
            vacationStartDate: employee.vacationStartDate,
            vacationEndDate: employee.vacationEndDate
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

        if (!validateDates(employee.vacationStartDate, employee.vacationEndDate) && employee.vacationStartDate && employee.vacationEndDate)
            throw new error.BadRequest('vacation dates are invalid');

        employee.email = employee.email ? employee.email.toLowerCase() : null;

        await EmployeeModel.findByIdAndUpdate(id, {
            $set: {
                phoneNumber: employee.phoneNumber,
                cuit: employee.cuit,
                jobTitle: employee.jobTitle,
                grossSalary: employee.grossSalary,
                entryDate: employee.entryDate,
                isUnionMember: employee.isUnionMember,
                dni: employee.dni,
                vacationStartDate: employee.vacationStartDate,
                vacationEndDate: employee.vacationEndDate,
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

const validateDates = (firstDate, secondDate) => {
    try {
        if (!moment(firstDate).isAfter(new Date(), 'days'))
            return false;
        return moment(secondDate).isAfter(firstDate);
    }
    catch (err) {
        throw new error.BadRequest('there was an unexpected error on the vacation dates');
    }
};