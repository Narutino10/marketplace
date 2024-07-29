const express = require('express');
const router = express.Router();
const returnController = require('../../controllers/ReturnsController');

router.post('/', returnController.createReturn);
router.get('/:id', returnController.getReturn);
router.put('/:id/status', returnController.updateReturnStatus);
router.get('/users/:userId/returns', returnController.listReturnsByUser);

module.exports = router;
