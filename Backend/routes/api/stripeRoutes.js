const express = require('express');
const router = express.Router();
const StripeController = require('../../controllers/StripeController');

router.post('/create-checkout-session', StripeController.createCheckoutSession);
router.post('/create-payment-intent', StripeController.createPaymentIntent);
router.post('/create-checkout-session-paypal', StripeController.createCheckoutSessionPaypal);

module.exports = router;

