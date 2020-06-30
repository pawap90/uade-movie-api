'use strict';

const rateModel = require('./rate.model');
const mongoose = require('mongoose');

/**
 * Gets all rates of a certain mediaId and mediaItem
 * @param {String} mediaType 'movie' or 'series'
 * @param {number} mediaId mediaId
 * @param {String} accountId accountId
 * @throws {Unauthorized} When credentials are wrong or not provided
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.getAllRates = async (mediaType, mediaId, accountId) => {
    try {
        const rates = await rateModel.find({ mediaType: mediaType, mediaId: mediaId })
            .populate('accountId');

        // adds ratedByMe=true if the rate was made by the logged user. else, adds ratedByMe=false
        const processedRates = rates.map(r => ({
            ratedBy: `${r.accountId.name} ${r.accountId.lastName}`,
            mediaType: r.mediaType,
            mediaId: r.mediaId,
            rating: r.rating,
            comment: r.comment,
            ratedByMe: (r.accountId._id.toString() === accountId)
        }));

        return processedRates;
    }
    catch (error) {
        throw new error.InternalServerError('Unexpected server error');
    }
};

/**
 * Put a rate for a certain mediaId and mediaType
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
        throw new error.InternalServerError('Unexpected server error');
    }
};