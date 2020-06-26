const mongoose = require('mongoose');

/**
 * Rate model schema.
 */
const rateSchema = new mongoose.Schema({
    accountId: { type: Object, required: true },
    MediaType: { type: String, required: true },
    mediaID: { type: Number, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: false }
});

module.exports = mongoose.model('list', rateSchema);