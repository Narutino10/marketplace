const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/PanierController');
const {authenticateToken} = require("../../middleware/authAdmin");


router.post('/', cartController.createCartItem);
router.get('/:userid', cartController.getCartItems);
router.put('/:id', authenticateToken,cartController.updateCartItem);
router.delete('/:id',authenticateToken, cartController.deleteCartItem);

module.exports = router;