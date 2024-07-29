require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Creates a Stripe Checkout Session to handle the payment process.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {Array} req.body.items - The items to be purchased.
 * @param {Object} req.body.customer - The customer information.
 * @param {string} req.body.customer.email - The customer's email address.
 * @param {Object} res - The response object.
 * 
 * @returns {void}
 */
exports.createCheckoutSession = async (req, res) => {
  const { items, customer } = req.body;

  console.log('Received items:', items);
  console.log('Received customer:', customer);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['paypal', 'card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name || "Test Product" // Nom du produit
          },
          unit_amount: item.price * 100, // Montant en cents
        },
        quantity: item.quantity || 1, // Quantité envoyée ou par défaut à 1
      })),
      customer_email: customer.email || "test@example.com", // Email envoyé ou par défaut
      mode: 'payment',
      success_url: 'http://localhost:5173/paymentSuccess',
      cancel_url: 'http://localhost:5173/paymentCancel',
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

/**
 * Creates a Stripe Checkout Session to handle the payment process.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {Array} req.body.items - The items to be purchased.
 * @param {Object} req.body.customer - The customer information.
 * @param {string} req.body.customer.email - The customer's email address.
 * @param {Object} res - The response object.
 * 
 * @returns {void}
 */
exports.createCheckoutSessionPaypal = async (req, res) => {
    const { items, customer } = req.body;
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['paypal','card'],
        line_items: items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name || "Test Product" // Nom du produit
            },
            unit_amount: item.price * 100, // Montant en cents
          },
          quantity: item.quantity || 1, // Quantité envoyée ou par défaut à 1
        })),
        customer_email: customer.email || "test@example.com", // Email envoyé ou par défaut
        mode: 'payment',
        success_url: 'http://localhost:5173/paymentSuccess',
        cancel_url: 'http://localhost:5173/paymentCancel',
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  };

/**
 * Creates a Stripe Payment Intent to handle the payment process.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {number} req.body.amount - The total amount to be charged in cents.
 * @param {Object} req.body.customer - The customer information.
 * @param {string} req.body.customer.email - The customer's email address.
 * @param {Object} res - The response object.
 * 
 * @returns {void}
 */
exports.createPaymentIntent = async (req, res) => {
  const { amount, customer } = req.body;

  console.log('Request body:', req.body); // Log the request body

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
      receipt_email: customer.email,
      metadata: {
        success_url: 'http://localhost:5173/paymentSuccess',
        cancel_url: 'http://localhost:5173/paymentCancel',
      }
    });

    console.log('Created PaymentIntent:', paymentIntent); // Log the created PaymentIntent

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};