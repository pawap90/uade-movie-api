'use strict';

const listModel = require('./list.model');

/**
 * Post list
 * @param {Object} listBody isDefault, name, accountId, isPublic & mediaItems
 * @throws {Unauthorized} When credentials are wrong or not provided
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.postList = async (listBody) => {
    listModel.create(listBody);
};