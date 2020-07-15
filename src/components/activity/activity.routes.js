'use strict';

const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const activityController = require('./activity.controller');

router.post('/', authorize, activityController.create);

router.get('/', authorize, activityController.getAllActivities);

router.get('/:id', authorize, activityController.getById);

router.put('/:id', authorize, activityController.updateById);

router.delete('/:id', authorize, activityController.deleteById);

module.exports = router;