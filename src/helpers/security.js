const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Generates JWT storing the given payload.
 * @param {object} payload - The payload to be stored in the JWT.
 * @returns {string} - The generated and encrypted JWT.
 */
module.exports.generateJwt = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SIGNKEY);

    return token;
};

/**
 * Verify if the token is valid and not expired.
 * @param {String} token JWT
 * @returns {String} Payload
 * @throws {ExpiredTokenError} If the token is valid but expired
 * @throws {InvalidTokenError} If the token is invalid
 */
module.exports.verifyJwt = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SIGNKEY);
    }
    catch (err) {
        if (err.name && err.name === 'JsonWebTokenError')
            throw new InvalidTokenError(err);
        if (err.name && err.name === 'TokenExpiredError')
            throw new ExpiredTokenError(err);

        throw err;
    }
};

/**
 * Encrypts text using a secret key.
 * @param {String} text - Text to encrypt
 * @returns {String} Encrypted text.
 */
module.exports.encrypt = (text) => {
    const encrypted = crypto.createHmac(process.env.CRYPTO_ALG, process.env.CRYPTO_KEY).update(text).digest('hex');

    return encrypted;
};

/**
 * Custom error for expired JWT
 * @param {*} err Original error
 * @param {String} message Custom message (optional)
 */
function ExpiredTokenError (err, message) {
    this.name = message || 'Expired token';
    this.stack = err ? err.stack : (new Error()).stack;
};
ExpiredTokenError.prototype = Object.create(Error.prototype);
ExpiredTokenError.prototype.constructor = ExpiredTokenError;
module.exports.ExpiredTokenError = ExpiredTokenError;

/**
 * Custom error for invalid JWT
 * @param {*} err Original error
 * @param {String} message Custom message (optional)
 */
function InvalidTokenError (err, message) {
    this.name = message || 'Invalid token';
    this.stack = err ? err.stack : (new Error()).stack;
};
InvalidTokenError.prototype = Object.create(Error.prototype);
InvalidTokenError.prototype.constructor = InvalidTokenError;
module.exports.InvalidTokenError = InvalidTokenError;