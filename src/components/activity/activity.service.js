'use strict';

const error = require('throw.js');
const mongoose = require('mongoose');

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
            employee: new mongoose.mongo.ObjectId(activity.employee)
        };
        newActivity = await ActivityModel.create(newActivity);

        await newActivity.populate('employee').execPopulate();
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

        let activity = await ActivityModel.findById(activityId);
        activity = activity.populate('employee', 'employeeNumber phoneNumber persona.name persona.lastName persona.email').execPopulate();
        
        return activity;
    } catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error');
        else throw err;
    }
};