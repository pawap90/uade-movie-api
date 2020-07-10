'use strict';

const mongoose = require('mongoose');

const planFrecuency = require('./plan-frecuency');

/**
 * Plan model schema.
 */
const planSchema = new mongoose.Schema({
    name: { type: String, required: true },
    frecuency: { type: String, required: true, enum: planFrecuency.options },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('plan', planSchema);