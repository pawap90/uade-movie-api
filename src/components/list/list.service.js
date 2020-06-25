'use strict';

const listModel = require('./list.model');
const mongoose = require('mongoose');

/**
 * Post list
 * @param {Object} list accountId, isDefault, name, isPublic & mediaItems
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.postList = async (list) => {
    list.accountId = mongoose.Types.ObjectId(list.accountId);

    await listModel.create(list);
};

/**
 * Get users lists
 * @param {Object} accountId accountId
 * @throws {Unauthorized} When credentials are wrong or not provided
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.getUsersLists = async (accountId) => {
    const accountObjetcId = mongoose.Types.ObjectId(accountId);

    return await listModel.find({ accountId: accountObjetcId }); ;
};