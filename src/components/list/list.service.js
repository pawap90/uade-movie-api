'use strict';

const error = require('throw.js');
const mongoose = require('mongoose');

const listModel = require('./list.model');

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
 * Add a media item to the specified list.
 * @param {String} listId Optional list id. If not provided the default list is used instead.
 * @param {String} accountId Account identifier.
 * @param {*} mediaItem Media item object
 */
module.exports.addItem = async (listId, accountId, mediaItem) => {
    try {
        let query = { isDefault: true, accountId: accountId };
        if (listId)
            query = { _id: listId, accountId: accountId };

        const result = await listModel.update(
            query,
            { $push: { mediaItems: mediaItem } }
        );
    }
    catch (err) {
        throw new error.InternalServerError('Unexpected Mongoose error adding media item to the list');
    }
};