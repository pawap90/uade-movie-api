'use strict';

const error = require('throw.js');

const InvoiceModel = require('./invoice.model');

const MemberService = require('../member.service');
const PlanFrecuency = require('../../plan/plan-frecuency');
const LegalData = require('../../../gym-legal-data');

/**
 * Creates a new invoice
 * @param {String} memberId Member identificator
 * @param {String} invoice Invoice data
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.create = async (memberId, invoice) => {
    try {
        if (!invoice || !memberId)
            throw new error.BadRequest('Invoice data or Current member id not provided');

        const currentMember = await MemberService.getById(memberId);

        // Create an MemberModel instance to allow mongoose to validate the model.
        let newInvoice = new InvoiceModel();
        newInvoice = {
            invoiceNumber: await generateInvoiceNumber(),
            endDate: PlanFrecuency.calculateExpiration(currentMember.plan.frecuency, new Date()),
            invoiceType: invoice.invoiceType,
            expirationDate: invoice.expirationDate,
            total: currentMember.plan.price,
            paymentDate: null
        };
        newInvoice.receiver = {
            name: currentMember.persona.name,
            lastName: currentMember.persona.lastName,
            cuit: currentMember.cuit,
            address: currentMember.persona.address
        };
        newInvoice.details = [
            {
                name: `${currentMember.plan.frecuency} - ${currentMember.plan.name}`,
                unitPrice: currentMember.plan.price,
                subtotal: currentMember.plan.price
            }
        ];
        newInvoice.sender = LegalData.legalData;

        console.log(newInvoice.sender);

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
 * Generate a secuential number for a new invoice based on the previously generated number.
 * E.g: I-00000001
 */
const generateInvoiceNumber = async () => {
    let number = 1;
    const lastInvoice = await InvoiceModel.findOne().sort({ createDate: -1 });

    if (lastInvoice) {
        const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1].replace('0', ''));
        number = lastNumber + 1;
    }

    const numberString = number.toString();
    const invoiceNumber = numberString.padStart(9 - numberString.length, '0');

    return invoiceNumber;
};