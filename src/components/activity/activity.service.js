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
    try {
        if (!activity)
            throw new error.BadRequest('activity data not provided');

        // Create an ActivityModel instance to allow mongoose to validate the model.
        let newActivity = new ActivityModel();
        newActivity = {
            name: activity.name,
            description: activity.description,
            availability: activity.availability,
            employee: activity.employee
        };
        await ActivityModel.create(newActivity);
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid activity data.');
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        else throw err;
    }
};

/**
 * Returns, by id, an activity with its inner documents populateds
 * @param {String} activityId Activity identifier
 * @throws {BadRequest} When the activity identifier is not provided
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getById = async (activityId) => {
    try {
        if (!activityId)
            throw new error.BadRequest('activity data not provided');

        const activity = await ActivityModel.findById(activityId)
            .populate('employee', 'employeeNumber phoneNumber persona.name persona.lastName persona.email');

        return activity;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        else throw err;
    }
};

/**
 * Returns all activities
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getAllActivities = async () => {
    try {
        const activities = await ActivityModel.find().select('name availability employee').populate('employee', 'persona.name persona.lastName');

        return activities;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        else throw err;
    }
};

/**
 * Updates an activity by id
 * @param {String} activityId Activity identifier
 * @param {Object} activity Activity data
 * @throws {BadRequest} When the activity identifier is not provided or the activity data is invalid
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.updateById = async (activityId, activity) => {
    try {
        if (!activityId || !activity)
            throw new error.BadRequest('activity data not provided');

        const fieldsToUpdate = {
            $set: {
                name: activity.name,
                description: activity.description,
                availability: activity.availability,
                employee: activity.employee
            }
        };

        await ActivityModel.findByIdAndUpdate(activityId, fieldsToUpdate, { runValidators: true });
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid activity data.');
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        throw err;
    }
};

/**
 * Delete an activity by id
 * @param {String} activityId Activity identifier
 * @throws {BadRequest} When the activity identifier is not provided
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.deleteById = async (activityId) => {
    try {
        if (!activityId)
            throw new error.BadRequest('activity id not provided');

        await ActivityModel.findByIdAndDelete(activityId);
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        throw err;
    }
};