const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const rateController = require('./rate.controller');

/**
 * Posts Rate of a media item
 */
router.post('/', authorize, rateController.postRate);

/**
 * Gets Rates of a media item
 */
router.get('/:mediaType/:mediaId', rateController.getAllRates);

module.exports = router;