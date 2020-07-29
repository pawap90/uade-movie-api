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
 * Get all invoices.
 */
router.get('/invoice', authorize, memberController.getAllInvoices);

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

/**
 * Get invoice by id
 */
router.get('/:id/cards', authorize, memberController.getCards);

/**
 * Add a new invoice for a member.
 */
router.post('/:id/invoice', authorize, memberController.addInvoice);

/**
 * Get invoice preview.
 */
router.get('/:id/invoice/preview', authorize, memberController.getInvoicePreview);

/**
 * Pay invoice
 */
router.put('/:memberId/invoice/:invoiceId', authorize, memberController.payInvoice);

/**
 * Get invoice by id
 */
router.get('/:memberId/invoice/:invoiceId', authorize, memberController.getInvoice);

module.exports = router;