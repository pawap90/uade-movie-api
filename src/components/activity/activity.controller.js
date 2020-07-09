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
 * Get all activities
 */
module.exports.getAllActivities = async (req, res, next) => {
    try {
        var activities = activityService.getAllActivities();

        return res.json(activities);
    } catch (err) {
        return next(err);
    }
};