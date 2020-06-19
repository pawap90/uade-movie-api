'use strict';

const error = require('throw.js');

const accountModel = require('./account.model');
const securityHelper = require('../../helpers/security');

/**
 * Login user
 * @param {Object} credentials email & password
 * @returns {Object} User general data and jwt
 * @throws {Unauthorized} When credentials are wrong or not provided
 * @throws {InternalServerError} When there's an unhandled error.
 */
module.exports.login = async (credentials) => {
    try {
        if (!credentials)
            throw new error.Unauthorized('Credentials not provided');

        credentials.email = credentials.email.toLowerCase();

        const user = await getByEmailFunc(credentials.email, true);
        if (!user)
            throw new error.Unauthorized('Incorrect credentials');

        const encryptedPassword = securityHelper.encrypt(credentials.password);

        if (encryptedPassword !== user.password)
            throw new error.Unauthorized('Incorrect credentials');

        const tokenPayload = {
            userId: user._id,
            email: user.email,
            timestamp: Date.now()
        };

        const jwt = securityHelper.generateJwt(tokenPayload);

        return { access: jwt, name: user.name, lastName: user.lastName, email: user.email };
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error on login');
        else throw err;
    }
};

/**
 * Retrieves a user by email.
 * @param {String} email - User email
 * @returns User
 * @throws {InternalServerError} When there's an unhandled error.
*/
module.exports.getByEmail = async (email) => {
    try {
        return getByEmailFunc(email);
    }
    catch (err) {
        throw new error.InternalServerError('Unexpected Mongoose error while retrieving user by email');
    }
};

/**
 * Retrieves a user by email.
 * @param {String} email User email
 * @param {bool} insecure If set to true, includes the user password in the result.
 */
const getByEmailFunc = async (email, insecure = false) => {
    let select = { password: false };
    if (insecure)
        select = {};

    return await accountModel.findOne({ email: email }, select);
};