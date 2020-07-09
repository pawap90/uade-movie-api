'use strict';

const express = require('express');
const router = express.Router();

const activityController = require('./activity.controller');

router.post('/', activityController.create);

router.get('/', activityController.getAllActivities);

module.exports = router;