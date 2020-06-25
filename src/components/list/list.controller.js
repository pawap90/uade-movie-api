const listService = require('./list.service');

/**
 * Post list
 */
module.exports.postList = async (req, res, next) => {
    try {
        var list = req.body;
        list.accountId = req.userClaims.userId;

        const result = await listService.postList(list);
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

/**
 * Add item to a user's list.
 */
module.exports.addItemToList = async (req, res, next) => {
    try {
        const lists = await listService.addItem(req.params.id, req.userClaims.userId, req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};