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
 * Update member information by id
 */
router.put('/:id', memberController.updateById);

/**
 * Delete member by id
 */
router.delete('/:id', memberController.deleteById);

/**
 * Update member plan by id
 */
router.put('/:id/plan', memberController.updatePlan);

module.exports = router;