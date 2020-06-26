const mongoose = require('mongoose');

const mediaTitemSchema = new mongoose.Schema({
    type: { type: String, required: true },
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imagePath: { type: String, required: true },
    genres: { type: [{ type: String }], required: true },
    year: { type: Number, required: true }
});

/**
 * List model schema.
 */
const listSchema = new mongoose.Schema({
    isDefault: { type: Boolean, required: true, default: false },
    name: { type: String, required: true },
    accountId: { type: Object, required: true },
    isPublic: { type: Boolean, required: true },
    mediaItems: { type: [mediaTitemSchema], required: false, default: [] }
});

module.exports = mongoose.model('list', listSchema);