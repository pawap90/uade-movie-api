'use strict';

const error = require('throw.js');

const ActivityModel = require('./activity.model');

/**
 * Creates a new activity
 * @param {Object} activity Activity data
 * @throws {BadRequest} When the activity data is invalid or not provided
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.create = async (activity) => {
    activity.active = typeof activity.active !== 'undefined' ? activity.active : true; // in case active value isnt set
    try {
        if (!activity)
            throw new error.BadRequest('activity data not provided');

        // Create an ActivityModel instance to allow mongoose to validate the model.
        let newActivity = new ActivityModel();
        newActivity = {
            name: activity.name,
            description: activity.description,
            availability: activity.availability,
            employee: activity.employee,
            active: activity.active
        };

        await ActivityModel.create(newActivity);
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid activity data.');
        else throw err;
    }
};