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

module.exports = router;