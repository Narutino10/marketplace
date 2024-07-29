const { createOrder, getOrderById } = require('../controllers/CommandeController');
const OrderService = require('../services/CommandeServices');

jest.mock('../services/CommandeServices');

describe('CommandeController', () => {
    describe('createOrder', () => {
        it('should create an order and return status 201', async () => {
            const req = {
                body: {
                    userId: 1,
                    statusOrder: 'new',
                    totalAmount: 100,
                    products: [{ productId: 1, quantity: 2 }]
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            OrderService.createOrder.mockResolvedValue(1);

            await createOrder(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(1);
        });

        it('should call next with an error if createOrder fails', async () => {
            const req = {
                body: {
                    userId: 1,
                    statusOrder: 'new',
                    totalAmount: 100,
                    products: [{ productId: 1, quantity: 2 }]
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            const error = new Error('Error creating order');
            OrderService.createOrder.mockRejectedValue(error);

            await createOrder(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getOrderById', () => {
        it('should get an order by id and return status 200', async () => {
            const req = { params: { orderId: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            OrderService.getOrderById.mockResolvedValue({ id: 1, statusOrder: 'new' });

            await getOrderById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 1, statusOrder: 'new' });
        });

        it('should call next with an error if getOrderById fails', async () => {
            const req = { params: { orderId: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            const error = new Error('Error getting order');
            OrderService.getOrderById.mockRejectedValue(error);

            await getOrderById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
