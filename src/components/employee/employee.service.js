'use strict';

const error = require('throw.js');

const EmployeeModel = require('./employee.model');

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