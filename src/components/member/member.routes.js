'use strict';

const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const memberController = require('./member.controller');

/**
 * Get all payments
 */
router.get('/payment', authorize, memberController.getAllPayments);

/**
 * Get all members
 */
router.get('/', authorize, memberController.getAll);

/**
 * Get member by id
 */
router.get('/:id', authorize, memberController.getById);

/**
 * Create member
 */
router.post('/', authorize, memberController.create);

/**
 * Add medical information to a member
 */
router.put('/:id/medical-information', authorize, memberController.updateMedicalInfo);

/**
 * Update member information by id
 */
router.put('/:id', authorize, memberController.updateById);

/**
 * Delete member by id
 */
router.delete('/:id', authorize, memberController.deleteById);

/**
 * Update member plan by id
 */
router.put('/:id/plan', authorize, memberController.updatePlan);

/**
 * Add a new payment from a member.
 */
router.post('/:id/payment', authorize, memberController.addPayment);

module.exports = router;