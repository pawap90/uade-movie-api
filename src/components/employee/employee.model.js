'use strict';

const mongoose = require('mongoose');

const personaModel = require('../commons/persona/persona.model');

/**
 * Employee model schema.
 */
const employeeSchema = new mongoose.Schema({
    persona: { type: personaModel, required: false },
    employeeNumber: { type: String, required: true }, // User friendly, 4 digit number - E.g: 0001
    phoneNumber: { type: String, required: true },
    cuit: { type: String, required: true },
    jobTitle: { type: String, required: true },
    grossSalary: { type: Number, required: true },
    entryDate: { type: Date, required: true },
    createDate: { type: Date, required: true, default: Date.now() }
});

module.exports = mongoose.model('employee', employeeSchema);