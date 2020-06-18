const accountService = require('./account.service');

/**
 * Login user.
 */
module.exports.login = async (req, res, next) => {
    try {
        const result = await accountService.login(req.body);

        return res.json(result);
    }
    catch (err) {
        return next(err);
    }
};
