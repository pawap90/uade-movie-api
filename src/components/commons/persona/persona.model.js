'use strict';

const mongoose = require('mongoose');

/**
 * Persona model schema.
 */
const personaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true }
});

module.exports = personaSchema;