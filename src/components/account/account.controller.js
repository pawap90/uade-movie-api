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
 * Register user account.
 */
module.exports.register = async (req, res, next) => {
    try {
        const registerResult = await accountService.register(req.body);

        return res.json(registerResult);
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

/**
 * Change user's password.
 */
module.exports.changePassword = async (req, res, next) => {
    try {
        await accountService.changePassword(req.userClaims.userId, req.body);

        return res.json({ message: 'Success!' });
    }
    catch (err) {
        return next(err);
    }
};