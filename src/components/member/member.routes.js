'use strict';

const express = require('express');
const router = express.Router();

const memberController = require('./member.controller');

/**
 * Create member
 */
router.post('/', memberController.create);

module.exports = router;