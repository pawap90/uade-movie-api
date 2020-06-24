const mongoose = require('mongoose');

/**
 * List model schema.
 */
const listSchema = new mongoose.Schema({
    isDefault: { type: Boolean, required: true },
    name: { type: String, required: true },
    accountId: { type: Object, required: true },
    isPublic: { type: Boolean, required: true },
    mediaItems: { type: Array, required: false, default: [] }
});

module.exports = mongoose.model('list', listSchema);