'use strict';

const error = require('throw.js');
const mongoose = require('mongoose');

const InvoiceModel = require('./invoice.model');

const MemberService = require('../member.service');
const PlanFrecuency = require('../../plan/plan-frecuency');
const LegalData = require('../../../gym-legal-data');

/**
 * Get all invoices
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getAllInvoices = async () => {
    try {
        const invoices = await InvoiceModel.find()
            .select('_id invoiceNumber invoiceType createDate status total receiver.name receiver.lastName')
            .sort({ date: -1 });

        return invoices;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        throw err;
    }
};

/**
 * Creates a new invoice
 * @param {String} memberId Member identificator
 * @param {String} invoice Invoice data
 * @throws {Conflict} When there's at least one previous invoice that overlaps with the new one.
 * @throws {BadRequest} When `memberId` or `invoice` is not provided.
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.create = async (memberId, invoice) => {
    try {
        if (!invoice || !memberId)
            throw new error.BadRequest('Invoice data or Current member id not provided');

        // Create an MemberModel instance to allow mongoose to validate the model.
        const newInvoice = await generateInvoice(memberId);

        const dateIsValid = await validateInvoiceDate(memberId, newInvoice.startDate);
        if (!dateIsValid)
            throw new error.Conflict('Overlapping invoice dates');

        newInvoice.invoiceNumber = await generateInvoiceNumber();
        newInvoice.invoiceType = invoice.invoiceType;
        newInvoice.expirationDate = invoice.expirationDate;

        await InvoiceModel.create(newInvoice);
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid Invoice data.');
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        throw err;
    }
};

/**
 * Generate an invoice preview for the specified member.
 * @param {String} memberId Member identifier
 * @throws {Conflict} When there's at least one previous invoice that overlaps with the new one.
 * @throws {BadRequest} When memberId is not provided.
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.preview = async (memberId) => {
    try {
        if (!memberId)
            throw new error.BadRequest('Invoice data or Current member id not provided');

        // Create an MemberModel instance to allow mongoose to validate the model.
        const newInvoice = await generateInvoice(memberId);

        const dateIsValid = await validateInvoiceDate(memberId, newInvoice.startDate);
        if (!dateIsValid)
            throw new error.Conflict('Overlapping invoice dates');

        return newInvoice;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        throw err;
    }
};

/**
 * Get single invoice by id.
 * @param {String} memberId Member identifier
 * @param {String} invoiceId Invoice identifier
 * @throws {BadRequest} When required info is not provided or memberId doesn't match invoice.
 * @throws {NotFound} When the invoice is not found
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getInvoice = async (memberId, invoiceId) => {
    try {
        if (!invoiceId || !memberId)
            throw new error.BadRequest('Invoice id or member id was not provided');

        const invoice = await InvoiceModel.findById(invoiceId);

        if (!invoice)
            throw new error.NotFound('Invoice not found');

        if (invoice.receiver.member.toString() !== memberId)
            throw new error.BadRequest('Invoice doesnt belong to the specified member');

        return invoice;
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid invoice information.');
        else throw err;
    }
};

/**
 * Pay invoice
 * @param {String} memberId Member identifier
 * @param {String} invoiceId Invoice identifier
 * @throws {BadRequest} When required info is not provided.
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.payInvoice = async (memberId, invoiceId) => {
    try {
        if (!invoiceId || !memberId)
            throw new error.BadRequest('Invoice id or member id was not provided');

        await InvoiceModel.findByIdAndUpdate(invoiceId, {
            $set: {
                status: 'paid',
                paymentDate: new Date()
            }
        }, { runValidators: true });
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid invoice information.');
        else throw err;
    }
};

/**
 * Generate a secuential number for a new invoice based on the previously generated number.
 * E.g: 00000001
 */
const generateInvoiceNumber = async () => {
    let number = 1;
    const lastInvoice = await InvoiceModel.findOne().sort({ createDate: -1 });

    if (lastInvoice) {
        const lastNumber = parseInt(lastInvoice.invoiceNumber.replace('0', ''));
        number = lastNumber + 1;
    }

    const numberString = number.toString();
    const invoiceNumber = numberString.padStart(9 - numberString.length, '0');

    return invoiceNumber;
};

/**
 * Generate an invoice for the specified member.
 * @param {String} memberId Member identifier
 */
const generateInvoice = async (memberId) => {
    const currentMember = await MemberService.getById(memberId);

    if (!currentMember.plan)
        throw new error.BadRequest('Member doesnt have a plan.');

    // Create an MemberModel instance to allow mongoose to validate the model.
    let newInvoice = new InvoiceModel();
    const startDate = new Date();
    newInvoice = {
        startDate: startDate,
        endDate: PlanFrecuency.calculateExpiration(currentMember.plan.frecuency, startDate),
        total: currentMember.plan.price,
        subtotal: currentMember.plan.price,
        paymentDate: null,
        status: 'pending'
    };
    newInvoice.receiver = {
        name: currentMember.persona.name,
        lastName: currentMember.persona.lastName,
        cuit: currentMember.cuit,
        address: currentMember.persona.address,
        member: currentMember._id
    };
    newInvoice.details = [
        {
            name: currentMember.plan.name,
            unitPrice: currentMember.plan.price,
            subtotal: currentMember.plan.price,
            quantity: 1
        }
    ];
    newInvoice.sender = LegalData.legalData;

    return newInvoice;
};

/**
 * Checks wether the new invoice's time period overlaps with any of the previous invoices periods.
 * @param {String} memberId Member identifier
 * @param {Date} startDate New invoice start date
 * @returns {Boolean} True if there's no overlapping.
 */
const validateInvoiceDate = async (memberId, startDate) => {
    const overlappingInvoices = await InvoiceModel.find({
        'receiver.member': mongoose.Types.ObjectId(memberId),
        endDate: { $gt: startDate }
    });

    if (overlappingInvoices && overlappingInvoices.length > 0)
        return false;

    return true;
};