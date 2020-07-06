'use strict';

const express = require('express');
const router = express.Router();

const memberController = require('./member.controller');

/**
 * Get all members
 */
router.get('/', memberController.getAll);

/**
 * Create member
 */
router.post('/', memberController.create);

/**
 * Add medical information to a member
 */
router.put('/:id/medical-information', memberController.updateMedicalInfo);

module.exports = router;