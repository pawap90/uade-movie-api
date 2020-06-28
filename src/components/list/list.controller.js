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
        next(err);
    }
};

/**
 * Add item to a user's list.
 */
module.exports.addItemToList = async (req, res, next) => {
    try {
        await listService.addItem(req.params.id, req.userClaims.userId, req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Delete item from user's list.
 *
 * Return the list with the deleted mediaitem
 */
module.exports.deleteItemFromList = async (req, res, next) => {
    try {
        const newListAfterDeletingMediaItem = await listService.deleteItemFromList(req.params.listId, req.params.mediaType, req.params.mediaId, req.userClaims.userId);

        return res.json(newListAfterDeletingMediaItem);
    }
    catch (err) {
        return next(err);
    }
};