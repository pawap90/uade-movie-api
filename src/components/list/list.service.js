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

    return await listModel.find({ accountId: accountObjetcId }); ;
};

/**
 * Delete list
 * @param {String} listId Optional list id. If not provided the default list is used instead.
 * @param {String} accountId Account identifier.
 * @throws {Unauthorized} List doesnt exist or the user doesnt have permissions over it
 * @throws {InternalServerError} Unhandled error.
 */
module.exports.deleteList = async (listId, accountId) => {
    try {
        const list = await listModel.findById(listId);

        if (!list || list.accountId.toString() !== accountId)
            throw new error.Unauthorized('The specified list doesnt exist or you dont have permissions over it');

        await listModel.findByIdAndRemove(listId);
    }
    catch (error) {
        throw new error.InternalServerError('Unexpected error updating the list');
    }
};

/**
 * Put list
 * @param {String} listId Optional list id. If not provided the default list is used instead.
 * @param {String} accountId Account identifier.
 * @param {Object} attributesToUpdate Attributes that will be updated.
 * @throws {Unauthorized} List doesnt exist or the user doesnt have permissions over it
 * @throws {InternalServerError} Unhandled error.
 */
module.exports.putList = async (listId, accountId, attributesToUpdate) => {
    try {
        const list = await listModel.findById(listId);

        if (!list || list.accountId.toString() !== accountId)
            throw new error.Unauthorized('The specified list doesnt exist or you dont have permissions over it');

        await listModel.findOneAndUpdate({ _id: listId }, attributesToUpdate);
    }
    catch (error) {
        throw new error.InternalServerError('Unexpected error updating the list');
    }
};