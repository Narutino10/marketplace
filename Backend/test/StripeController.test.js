const { createCheckoutSession, createCheckoutSessionPaypal, createPaymentIntent } = require('../controllers/StripeController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

jest.mock('stripe');

describe('StripeController', () => {
    describe('createCheckoutSession', () => {
        it('should create a checkout session and return session ID', async () => {
            const req = {
                body: {
                    items: [{ name: 'Product 1', price: 1000, quantity: 1 }],
                    customer: { email: 'test@example.com' }
                }
            };
            const res = {
                json: jest.fn()
            };
            const next = jest.fn();

            const session = { id: 'session_1' };
            stripe.checkout.sessions.create.mockResolvedValue(session);

            await createCheckoutSession(req, res, next);

            expect(res.json).toHaveBeenCalledWith({ sessionId: 'session_1' });
        });

        it('should return status 500 if there is an error', async () => {
            const req = {
                body: {
                    items: [{ name: 'Product 1', price: 1000, quantity: 1 }],
                    customer: { email: 'test@example.com' }
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            const error = new Error('Error creating checkout session');
            stripe.checkout.sessions.create.mockRejectedValue(error);

            await createCheckoutSession(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error', details: error.message });
        });
    });

    describe('createPaymentIntent', () => {
        it('should create a payment intent and return client secret', async () => {
            const req = {
                body: {
                    amount: 1000,
                    customer: { email: 'test@example.com' }
                }
            };
            const res = {
                json: jest.fn()
            };
            const next = jest.fn();

            const paymentIntent = { client_secret: 'secret_1' };
            stripe.paymentIntents.create.mockResolvedValue(paymentIntent);

            await createPaymentIntent(req, res, next);

            expect(res.json).toHaveBeenCalledWith({ clientSecret: 'secret_1' });
        });

        it('should return status 500 if there is an error', async () => {
            const req = {
                body: {
                    amount: 1000,
                    customer: { email: 'test@example.com' }
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            const error = new Error('Error creating payment intent');
            stripe.paymentIntents.create.mockRejectedValue(error);

            await createPaymentIntent(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error', details: error.message });
        });
    });
});
