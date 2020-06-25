const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const listController = require('./list.controller');

/**
 * Create new list.
 */
router.post('/', authorize, listController.postList);

router.get('/', authorize, listController.getUsersLists);

router.post('/:id/item', authorize, listController.addItemToList);

router.post('/item', authorize, listController.addItemToList);

module.exports = router;