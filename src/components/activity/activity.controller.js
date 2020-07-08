'use strict';

const activityService = require('./activity.service');

/**
 * Create Activity.
 */
module.exports.create = async (req, res, next) => {
    try {
        await activityService.create(req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Get populated Activity by id.
 */
module.exports.getById = async (req, res, next) => {
    try {
        var activity = await activityService.getById(req.params.id);

        return res.json(activity);
    }
    catch (err) {
        return next(err);
    }
};