'use strict';

const mongoose = require('mongoose');

/**
 * medical Information model schema.
 */
const medicalInformationSchema = new mongoose.Schema({
    certificateIssuedDate: { type: Date, required: false },
    certificateIssuerMedicalLicense: { type: String, required: true },
    observations: { type: String, required: true },
    hasHeartProblems: { type: Boolean, required: true },
    hasAsthma: { type: Boolean, required: true },
    hasDiabetes: { type: Boolean, required: true },
    smokes: { type: Boolean, required: true }
});

module.exports = mongoose.model('medicalInformation', medicalInformationSchema);