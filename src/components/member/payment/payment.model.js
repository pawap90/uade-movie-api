'use strict';

const mongoose = require('mongoose');

/**
 * Payment model schema.
 */
const paymentSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.ObjectId, ref: 'member', required: true },
    date: { type: Date, required: true, default: Date.now() },
    expirationDate: { type: Date, required: true },
    plan: { type: mongoose.Schema.ObjectId, ref: 'plan', required: true },
    value: { type: Number, required: true }
});

module.exports = mongoose.model('payment', paymentSchema);