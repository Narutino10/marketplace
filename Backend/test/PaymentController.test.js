const { processPayment } = require('../controllers/PaymentController');
const paymentService = require('../services/PaymentService');

jest.mock('../services/PaymentService');

describe('PaymentController', () => {
    describe('processPayment', () => {
        it('should process payment and return status 200', async () => {
            const req = { body: { amount: 1000, token: 'tok_visa' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            paymentService.createPayment.mockResolvedValue({ id: 'payment_1', status: 'succeeded' });

            await processPayment(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 'payment_1', status: 'succeeded' });
        });

        it('should return status 500 if there is an error', async () => {
            const req = { body: { amount: 1000, token: 'tok_visa' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            const error = new Error('Error processing payment');
            paymentService.createPayment.mockRejectedValue(error);

            await processPayment(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error processing payment' });
        });
    });
});
