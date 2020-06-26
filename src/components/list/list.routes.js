const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const listController = require('./list.controller');

/**
 * Create new list.
 */
router.post('/', authorize, listController.postList);

router.get('/', authorize, listController.getUsersLists);

/**
 * Add item to list by id
 */
router.post('/:id/item', authorize, listController.addItemToList);

/**
 * Add item to the default list
 */
router.post('/item', authorize, listController.addItemToList);

module.exports = router;