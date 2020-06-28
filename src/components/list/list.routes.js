const express = require('express');
const router = express.Router();

const authorize = require('../../middleware/authorization');
const listController = require('./list.controller');

/**
 * Create new list.
 */
router.post('/', authorize, listController.postList);

router.get('/', authorize, listController.getUsersLists);

router.delete('/:listId', authorize, listController.deleteList);

router.put('/:listId', authorize, listController.putList);

/**
 * Add item to list by id
 */
router.post('/:id/item', authorize, listController.addItemToList);

/**
 * Add item to the default list
 */
router.post('/item', authorize, listController.addItemToList);

router.delete('/:listId/item/:mediaType/:mediaId', authorize, listController.deleteItemFromList);

module.exports = router;