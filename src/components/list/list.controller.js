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
 * Delete list
 */
module.exports.deleteList = async (req, res, next) => {
    try {
        await listService.deleteList(req.params.listId, req.userClaims.userId);

        return res.json('Success!');
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Put list
 */
module.exports.putList = async (req, res, next) => {
    try {
        await listService.putList(req.params.listId, req.userClaims.userId, req.body);

        return res.json('Success!');
    }
    catch (err) {
        return next(err);
    }
};