'use strict';

const mongoose = require('mongoose');

/**
 * Detail model schema
 */
const DetailSchema = new mongoose.Schema({
    description: { type: String, required: true },
    value: { type: Number, required: true }
});

/*
* employeeData model schema
*/
const employeeDataSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.ObjectId, ref: 'employee', required: true },
    jobTitle: { type: String, required: true },
    fullName: { type: String, required: true },
    employeeNumber: { type: String, required: true },
    cuit: { type: String, required: true },
    entryDate: { type: Date, required: true },
    seniority: { type: Number, required: true }
});

/**
 * Gym legal data.
 */
const legalDataSchema = new mongoose.Schema({
    cuit: { type: String, required: true },
    sellingAddressCode: { type: String, required: true },
    grossIncome: { type: String, required: true },
    activityStartDate: { type: Date, required: true },
    legalName: { type: String, required: true },
    legalAddress: { type: String, required: true },
    vatCondition: { type: String, required: true }
});

/**
 * Remuneration model schema.
 */
const remunerationSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    details: { type: [DetailSchema], required: true },
    total: { type: Number, required: true },
    workplace: { type: String, required: true, default: 'Capital Federal' },
    typeOfContract: { type: String, required: true, default: 'Tiempo indeterminado' },
    cct: { type: String, required: true, default: '700/14' },
    medicalPlan: { type: String, required: true, default: 'OSPEDYC' },
    paymentPlace: { type: String, required: true, default: 'Buenos Aires' },
    paymentPeriod: { type: String, required: true },
    employeeData: { type: employeeDataSchema, required: true },
    legalData: { type: legalDataSchema, required: true }
});

module.exports = mongoose.model('remuneration', remunerationSchema);