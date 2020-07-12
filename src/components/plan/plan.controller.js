'use strict';

const planService = require('./plan.service');

/**
 * Create plan.
 */
module.exports.create = async (req, res, next) => {
    try {
        await planService.create(req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Delete a plan by id.
 */
module.exports.deleteById = async (req, res, next) => {
    try {
        await planService.deleteById(req.params.id);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Update plan by id.
 */
module.exports.updateById = async (req, res, next) => {
    try {
        await planService.updateById(req.params.id, req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Get all plans.
 */
module.exports.getAllPlans = async (req, res, next) => {
    try {
        const plans = await planService.getAllPlans();

        return res.json(plans);
    }
    catch (err) {
        return next(err);
    }
};