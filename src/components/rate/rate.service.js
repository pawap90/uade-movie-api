'use strict';

const rateModel = require('./rate.model');
const mongoose = require('mongoose');

/**
 * Get all rates for a mediaItem and mediaType
 * @param {String} mediaType 'movie' or 'series'
 * @param {number} mediaId mediaId
 * @param {String} accountId accountId
 * @throws {Unauthorized} When credentials are wrong or not provided
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.getAllRates = async (mediaType, mediaId, accountId) => {
    try {
        const rates = await rateModel.find({ mediaType, mediaId });

        // if (!list || list.accountId.toString().valueOf() !== accountId)
        //     throw new error.Unauthorized('The specified list doesnt exist or you dont have permissions over it');

        // await listModel.findOneAndUpdate({ _id: listId }, attributesToUpdate);
    }
    catch (error) {
        throw new error.InternalServerError('Unexpected error updating the list');
    }
};

/**
 * Get all rates for a mediaItem and mediaType
 * @param {String} accountId accountId
 * @param {Object} rate rate body
 * @throws {Unauthorized} When credentials are wrong or not provided
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.postRate = async (accountId, rate) => {
    try {
        var rateItem = rate;
        rateItem.accountId = mongoose.Types.ObjectId(accountId);

        await rateModel.create(rateItem);
    }
    catch (error) {
        throw new error.InternalServerError('Unexpected error updating the list');
    }
};