'use strict';

const express = require('express');
const router = express.Router();

const activityController = require('./activity.controller');

router.post('/', activityController.create);

module.exports = router;