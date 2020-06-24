const listService = require('./list.service');

/**
 * Post list
 */
module.exports.postList = async (req, res, next) => {
    try {
        const result = await listService.postList(req.body);

        return res.json(result);
    }
    catch (err) {
        return next(err);
    }
};

module.exports.getName = async (req, res, next) => {
    try {
        return res.json('Da name');
    }
    catch (err) {
        return next(err);
    }
};