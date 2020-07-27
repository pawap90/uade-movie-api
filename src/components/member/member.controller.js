'use strict';

const memberService = require('./member.service');
const paymentService = require('./payment/payment.service');
const invoiceService = require('./invoice/invoice.service');

/**
 * Get all members
 */
module.exports.getAll = async (req, res, next) => {
    try {
        const members = await memberService.getAll();

        return res.json(members);
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Get all payments
 */
module.exports.getAllPayments = async (req, res, next) => {
    try {
        const payments = await paymentService.getAllPayments();

        return res.json(payments);
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Get member by id
 */
module.exports.getById = async (req, res, next) => {
    try {
        const member = await memberService.getById(req.params.id);

        return res.json(member);
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Create member.
 */
module.exports.create = async (req, res, next) => {
    try {
        await memberService.create(req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Update medical information of a member by id.
 */
module.exports.updateMedicalInfo = async (req, res, next) => {
    try {
        await memberService.updateMedicalInfo(req.params.id, req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Update member by id.
 */
module.exports.updateById = async (req, res, next) => {
    try {
        await memberService.updateById(req.params.id, req.body);

        return res.json({ message: 'Success!' });
    }
    catch (err) {
        return next(err);
    }
};

/*
* Delete member by id
*/
module.exports.deleteById = async (req, res, next) => {
    try {
        await memberService.deleteById(req.params.id);

        return res.json('Success!');
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Update member's plan.
 */
module.exports.updatePlan = async (req, res, next) => {
    try {
        await memberService.updatePlan(req.params.id, req.body);

        return res.json('Success!');
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Add a new payment from a member.
 */
module.exports.addPayment = async (req, res, next) => {
    try {
        await paymentService.addPayment(req.params.id);

        return res.json('Success!');
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Add a new invoice for a member.
 */
module.exports.addInvoice = async (req, res, next) => {
    try {
        await invoiceService.create(req.params.id, req.body);

        return res.json('Success!');
    }
    catch (err) {
        return next(err);
    }
};