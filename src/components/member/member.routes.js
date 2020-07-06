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

module.exports = router;