'use strict';

const error = require('throw.js');

const PaymentModel = require('./payment.model');

const memberService = require('../member.service');
const planFrecuency = require('../../plan/plan-frecuency');

/**
 * Adds a new payment for a member
 * @param {String} memberId Member identifier
 * @throws {BadRequest} When the member id is not provided
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.addPayment = async (memberId) => {
    try {
        if (!memberId)
            throw new error.BadRequest('member id not provided');

        const member = await memberService.getById(memberId);
        if (!member.plan)
            throw new error.BadRequest('Must assign a plan to the member before registering a payment');

        const payment = new PaymentModel();
        payment.member = member;
        payment.value = member.plan.price;
        payment.plan = member.plan;
        payment.date = new Date();
        payment.expirationDate = planFrecuency.calculateExpiration(member.plan.frecuency, payment.date);

        await PaymentModel.create(payment);
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid payment data.');
        throw err;
    }
};