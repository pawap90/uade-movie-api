'use strict';

const mongoose = require('mongoose');

/**
 * Sender model schema.
 */
const senderSchema = new mongoose.Schema({
    cuit: { type: String, required: true },
    sellingAddressCode: { type: String, required: true },
    grossIncome: { type: String, required: true },
    activityStartDate: { type: Date, required: true },
    legalName: { type: String, required: true },
    legalAddress: { type: String, required: true },
    vatCondition: { type: String, required: true }
});

/**
 * Receiver model schema.
 */
const receiverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    cuit: { type: String, required: true },
    address: { type: String, required: true }
});

/**
 * Invoice Item model schema.
 */
const invoiceItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true }
});

/**
 * Invoice model schema.
 */
const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true },
    startDate: { type: Date, required: true, default: Date.now() },
    endDate: { type: Date, required: true },
    expirationDate: { type: Date, required: true },
    createDate: { type: Date, required: true, default: Date.now() },
    invoiceType: { type: String, required: true },
    sender: { type: senderSchema, required: true },
    receiver: { type: receiverSchema, required: true },
    details: { type: [invoiceItemSchema], required: true },
    total: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    paymentDate: { type: Date, required: false }
});

module.exports = mongoose.model('invoice', invoiceSchema);