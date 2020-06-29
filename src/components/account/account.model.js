const mongoose = require('mongoose');

/**
 * Account model schema.
 */
const accountSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    emailConfirmed: { type: Boolean, default: false },
    genres: { type: [{ type: String }], required: true }
});

module.exports = mongoose.model('account', accountSchema);