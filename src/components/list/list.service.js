'use strict';

const listModel = require('./list.model');
const accountService = require('../account/account.service');

/**
 * Post list
 * @param {Object} listBody email, isDefault, name, isPublic & mediaItems
 * @throws {Unauthorized} When credentials are wrong or not provided
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.postList = async (listBody) => {
    let list = listBody;
    list.accountId = await (await accountService.getByEmail(listBody.email))._id;
    listModel.create(list);
};