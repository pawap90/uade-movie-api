const accountService = require('./account.service');

/**
 * Login user.
 */
module.exports.login = async (req, res, next) => {
    try {
        const loginResult = await accountService.login(req.body);

        return res.json(loginResult);
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Get current user data.
 */
module.exports.getCurrentUser = async (req, res, next) => {
    try {
        const user = await accountService.getByEmail(req.userClaims.email);

        return res.json(user);
    }
    catch (err) {
        return next(err);
    }
};