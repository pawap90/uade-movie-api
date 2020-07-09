const mongoose = require('mongoose');

const personaModel = require('../commons/persona/persona.model');

/**
 * Account model schema.
 */
const accountSchema = new mongoose.Schema({
    persona: { type: personaModel, required: false },
    password: { type: String, required: true }
});

module.exports = mongoose.model('account', accountSchema);