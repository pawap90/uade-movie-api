'use strict';

const error = require('throw.js');
const PlanModel = require('./plan.model');

/**
 * Creates a new plan
 * @param {Object} plan Plan data
 * @throws {BadRequest} When the plan data is invalid or not provided
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.create = async (plan) => {
    try {
        if (!plan)
            throw new error.BadRequest('plan data not provided');

        // Create an PlanModel instance to allow mongoose to validate the model.
        let newPlan = new PlanModel();
        newPlan = {
            name: plan.name,
            frecuency: plan.frecuency,
            price: plan.price
        };

        await PlanModel.create(newPlan);
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid plan data.');
        throw err;
    }
};

/**
 * Delete a plan by id
 * @param {String} planId Plan identifier
 * @throws {BadRequest} When the plan identifier is invalid or not provided
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.deleteById = async (planId) => {
    try {
        if (!planId)
            throw new error.BadRequest('plan identifier not provided');

        await PlanModel.findByIdAndDelete(planId);
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid plan data.');
        else if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        throw err;
    }
};