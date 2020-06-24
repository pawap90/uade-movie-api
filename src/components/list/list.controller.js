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

/**
 * Get users lists
 */
module.exports.getUsersLists = async (req, res, next) => {
    try {
        const lists = await listService.getUsersLists(req.userClaims.userId);

        return res.json(lists);
    }
    catch (err) {
        return next(err);
    }
};