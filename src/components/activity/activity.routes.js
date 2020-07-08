'use strict';

const express = require('express');
const router = express.Router();

const activityController = require('./activity.controller');

router.post('/', activityController.create);

router.get('/:id', activityController.getById);

module.exports = router;