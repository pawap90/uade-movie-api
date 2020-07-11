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
 * Get all plans
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getAllPlans = async () => {
    try {
        const plans = await PlanModel.find();

        return plans;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        else throw err;
    }
};