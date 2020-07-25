'use strict';

const error = require('throw.js');

const InvoiceModel = require('./invoice.model');

const MemberService = require('../member.service');

/**
 * Creates a new invoice
 * @param {String} currentMemberId Member identificator
 * @param {String} invoice Invoice data
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.create = async (currentMemberId, invoice) => {
    try {
        if (!invoice || !currentMemberId)
            throw new error.BadRequest('Invoice data or Current member id not provided');

        currentMember = MemberService.getById(currentMemberId);

        // Create an MemberModel instance to allow mongoose to validate the model.
        let newInvoice = new InvoiceModel();
        newInvoice = {
            invoiceNumber: await generateInvoiceNumber(),
            endDate: invoice.endDate,
            expirationDate: invoice.expirationDate,
            invoiceType: invoice.invoiceType,
            paymentDate: null,
        };
        newInvoice.sender = {
            cuit: '12-12345678-9',
            sellingAddressCode: '00001',
            grossIncome: '12-12345678-9',
            activityStartDate: '07-01-2020',
            legalName: 'Gimnasio A',
            legalAddress: 'Calle A 1234 - Ciudad de buenos aires',
            vatCondition: 'Responsable Inscripto'
        };
        newInvoice.receiver = {
            name: 'Jane',
            lastName: 'Monkeys',
            cuit: '12-12345678-9',
            address: 'Always Alive Av. 456'
        };


        await MemberModel.create(newMember);
    }
    catch (err) {
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
    const invoiceNumber = 'I-' + numberString.padStart(9 - numberString.length, '0');

    return invoiceNumber;
};