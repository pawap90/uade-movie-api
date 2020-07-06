'use strict';

const mongoose = require('mongoose');

const personaModel = require('../commons/persona/persona.model');

const medicalInformationModel = require('./medicalInformation.model');

/**
 * Member model schema.
 */
const memberSchema = new mongoose.Schema({
    persona: { type: personaModel, required: false },
    memberNumber: { type: String, required: true }, // User friendly, 6 digit number - E.g: 000001
    dni: { type: String, required: true },
    emergencyPhoneNumber: { type: String, required: true },
    entryDate: { type: Date, required: true },
    createDate: { type: Date, required: true, default: Date.now() },
    medicalInformation: { type: { medicalInformationModel } }
});

module.exports = mongoose.model('member', memberSchema);