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