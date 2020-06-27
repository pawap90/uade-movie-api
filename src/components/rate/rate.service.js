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
        const rates = await rateModel.find({ mediaType: mediaType }).find({ mediaId: mediaId });
        // TODO: see requirements on issue
        return rates;
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