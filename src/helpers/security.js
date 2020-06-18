const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Generates JWT storing the given payload.
 * @param {object} payload - The payload to be stored in the JWT.
 * @returns {string} - The generated and encrypted JWT.
 */
module.exports.generateJwt = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SIGNKEY, { expiresIn: process.env.JWT_EXPIRATION });

    return token;
};

/**
 * Encrypts text using a secret key.
 * @param {string} text - Text to encrypt
 * @param {string} [cryptoPassword=null] - Crypto key (if not provided takes default from config.js)
 * @returns {string} Encrypted text.
 */
module.exports.encrypt = (text) => {
    const encrypted = crypto.createHmac(process.env.CRYPTO_ALG, process.env.CRYPTO_KEY).update(text).digest('hex');

    return encrypted;
};