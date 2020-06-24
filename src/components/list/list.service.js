'use strict';

const listModel = require('./list.model');
const accountService = require('../account/account.service');
const mongoose = require('mongoose');


/**
 * Post list
 * @param {Object} listBody email, isDefault, name, isPublic & mediaItems
 * @throws {Unauthorized} When credentials are wrong or not provided
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.postList = async (listBody) => {
    const list = listBody;
    list.accountId = await (await accountService.getByEmail(listBody.email))._id;
    listModel.create(list);
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