const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const listController = require('./list.controller');

/**
 * Create new list.
 */
router.post('/', authorize, listController.postList);

router.get('/', authorize, listController.getUsersLists);

module.exports = router;