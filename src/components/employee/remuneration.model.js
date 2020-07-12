'use strict';

const mongoose = require('mongoose');

/**
 * Detail model schema
 */
const DetailSchema = new mongoose.Schema({
    description: { type: String, required: true },
    value: { type: Number, required: true }
});

/**
 * Remuneration model schema.
 */
const remunerationSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    date: { type: Date, required: true },
    details: { type: [DetailSchema], required: true },
    total: { type: Number, required: true }
});

module.exports = mongoose.model('remuneration', remunerationSchema);