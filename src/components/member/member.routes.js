'use strict';

const express = require('express');
const router = express.Router();

const memberController = require('./member.controller');

/**
 * Get all members
 */
router.get('/', memberController.getAll);

/**
 * Get member by id
 */
router.get('/:id', memberController.getById);

/**
 * Create member
 */
router.post('/', memberController.create);

/**
 * Add medical information to a member
 */
router.put('/:id/medical-information', memberController.updateMedicalInfo);

/**
 * Delete member by id
 */
router.delete('/:id', memberController.deleteById);

module.exports = router;