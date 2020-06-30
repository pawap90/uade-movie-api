const rateService = require('./rate.service');

/**
 * Get Rates for a media item by mediaType and mediaId
 */
module.exports.getAllRates = async (req, res, next) => {
    try {
        const userId = req.userClaims ? req.userClaims.userId : null;
        const result = await rateService.getAllRates(req.params.mediaType, req.params.mediaId, userId);
        return res.json(result);
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Posts Rate of a media item
 */
module.exports.postRate = async (req, res, next) => {
    try {
        await rateService.postRate(req.userClaims.userId, req.body);

        return res.json('Success!');
    }
    catch (err) {
        return next(err);
    }
};