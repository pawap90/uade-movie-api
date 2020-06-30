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
    try {
        list.accountId = mongoose.Types.ObjectId(list.accountId);

        await listModel.create(list);
    }
    catch (err) {
        throw new error.InternalServerError('Unexpected error creating the list');
    }
};

/**
 * Get users lists
 * @param {Object} accountId accountId
 * @throws {Unauthorized} When credentials are wrong or not provided
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.getUsersLists = async (accountId) => {
    try {
        const accountObjetcId = mongoose.Types.ObjectId(accountId);

        return await listModel.find({ accountId: accountObjetcId });;
    }
    catch (err) {
        throw new error.InternalServerError('Unexpected error getting user lists');
    }
};

/**
 * Get a single list by id
 * @param {String} accountId account identifier
 * @param {String} listId list identifier
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.getById = async (listId, accountId) => {
    try {
        const accountObjetcId = mongoose.Types.ObjectId(accountId);
        const listObjectId = mongoose.Types.ObjectId(listId);

        return await listModel.findOne({ _id: listObjectId, accountId: accountObjetcId });
    }
    catch (err) {
        throw new error.InternalServerError('Unexpected error getting list by id');
    }
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
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error deleting the list');
        else
            throw err;
    }
};

/**
 * Delete Item from List
 * @param {String} listId list id
 * @param {String} mediaType mediaItem type, movie or series
 * @param {String} mediaId mediaItem id, mediaId
 * @param {String} accountId Account identifier.
 * @throws {Unauthorized} List doesnt exist or the user doesnt have permissions over it
 * @throws {InternalServerError} Unhandled error.
 */
module.exports.deleteItemFromList = async (listId, mediaType, mediaId, accountId) => {
    try {
        var list = await listModel.findById(listId);

        if (!list || list.accountId.toString() !== accountId)
            throw new error.Unauthorized('The specified list doesnt exist or you dont have permissions over it');

        await listModel.findByIdAndUpdate(listId,
            {
                $pull: {
                    mediaItems: {
                        id: parseInt(mediaId), type: mediaType
                    }
                }
            });
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error deleting the list');
        else
            throw err;
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
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error updating the list');
        else
            throw err;
    }
};

/**
* Add a media item to the specified list.
* @param {String} listId Optional list id. If not provided the default list is used instead.
* @param {String} accountId Account identifier.
* @param {*} mediaItem Media item object
*/
module.exports.addItem = async (listId, accountId, mediaItem) => {
    try {
        const accountObjetcId = mongoose.Types.ObjectId(accountId);
        let query = { isDefault: true, accountId: accountObjetcId };
        if (listId)
            query = { _id: listId, accountId: accountObjetcId };

        const result = await listModel.update(
            query,
            { $push: { mediaItems: mediaItem } }
        );

        return result;
    }
    catch (err) {
        throw new error.InternalServerError('Unexpected Mongoose error adding media item to the list');
    }
};