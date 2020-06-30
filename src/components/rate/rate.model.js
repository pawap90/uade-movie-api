const mongoose = require('mongoose');

/**
 * Rate model schema.
 */
const rateSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.ObjectId,
        ref: 'account',
        required: true
    },
    mediaType: { type: String, required: true },
    mediaId: { type: Number, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: false }
});

module.exports = mongoose.model('rate', rateSchema);