const express = require('express');
const router = express.Router();
const OrderController = require('../../controllers/CommandeController');

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);
router.get('/user/:userId', OrderController.getOrdersByUserId);
router.get('/:orderId', OrderController.getOrderById);
router.put('/:orderId', OrderController.updateOrder);
router.delete('/:orderId', OrderController.deleteOrder);
router.post('/:orderId/products/:productId', OrderController.addProductToOrder);
router.delete('/:orderId/products/:productId', OrderController.removeProductFromOrder);
router.get('/:orderId/products', OrderController.getProductsFromOrder);

module.exports = router;
