const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/PaymentController');

// Payment routes
router.post('/', paymentController.createPayment);
router.get('/:id', paymentController.getPayment);
router.put('/:id/status', paymentController.updatePaymentStatus);
router.get('/users/:userId/payments', paymentController.listPaymentsByUser);

module.exports = router;

