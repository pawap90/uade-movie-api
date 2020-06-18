const error = require('throw.js');

const securityHelper = require('../helpers/security');

/**
 * Authorization middleware
 * Gets the JWT from the authorization header and validates it.
 */
module.exports = function (req, res, next) {
    const token = req.headers.authorization;

    if (!token)
        throw new error.Unauthorized('Must provide credentials');

    try {
        const userClaims = securityHelper.verifyJwt(token);
        req.userClaims = userClaims;

        next();
    }
    catch (err) {
        if (err instanceof securityHelper.ExpiredTokenError)
            throw new error.Unauthorized('Token expired');
        else if (err instanceof securityHelper.InvalidTokenError)
            throw new error.Unauthorized('Invalid token');

        throw new error.InternalServerError('Unexpected error validating user');
    }
};