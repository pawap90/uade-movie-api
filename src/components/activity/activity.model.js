const mongoose = require('mongoose');

/**
 * Activity model schema.
 */
const activitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    availability: { type: String, required: true },
    employee: { type: mongoose.Schema.ObjectId, ref:"employee" },
    active: { type: Boolean, requires: true, default: true }
});

module.exports = mongoose.model('activity', activitySchema);