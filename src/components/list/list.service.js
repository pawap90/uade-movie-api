'use strict';

const listModel = require('./list.model');
const error = require('throw.js');
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

    return await listModel.find({ accountId: accountObjetcId });;
};

/**
 * Delete list
 * @param {String} listId Optional list id. If not provided the default list is used instead.
 * @param {String} accountId Account identifier.
 * @throws {Unauthorized} When the user doesnt own the list.
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.deleteList = async (listId, accountId) => {
    const list = await listModel.findById(listId);

    if(!list || list.accountId != accountId)
        throw new error.Unauthorized('The specified list doesnt exist or you dont have permissions over it');

    await listModel.findByIdAndRemove(listId);
};



