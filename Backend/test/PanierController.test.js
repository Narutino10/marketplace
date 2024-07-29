const { createCartItem, getCartItems, updateCartItem, deleteCartItem } = require('../controllers/PanierController');
const Cart = require('../models/postgres_models/Panier');
const Client = require('../models/postgres_models/UserPg');
const ProductService = require('../services/productService');

jest.mock('../models/postgres_models/Panier');
jest.mock('../models/postgres_models/Userpg');
jest.mock('../services/productService');

describe('PanierController', () => {
    describe('createCartItem', () => {
        it('should create a cart item and return status 201', async () => {
            const req = { body: { userid: 1, productid: 1, quantity: 2 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            Client.findByPk.mockResolvedValue({ id: 1 });
            ProductService.getProductById.mockResolvedValue({ id: 1, stock_available: 10 });
            Cart.create.mockResolvedValue({ id: 1, userid: 1, productid: 1, quantity: 2 });
            
            await createCartItem(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, userid: 1, productid: 1, quantity: 2 });
        });

        it('should return status 404 if client is not found', async () => {
            const req = { body: { userid: 1, productid: 1, quantity: 2 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            Client.findByPk.mockResolvedValue(null);
            
            await createCartItem(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Client not found' });
        });
    });

    describe('getCartItems', () => {
        it('should get cart items by user id and return status 200', async () => {
            const req = { params: { userid: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            Cart.findAll.mockResolvedValue([{ id: 1, productid: 1, quantity: 2 }]);
            ProductService.getProductsByIds.mockResolvedValue([{ id: 1 }]);
            
            await getCartItems(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ id: 1, productid: 1, quantity: 2, product: { id: 1 } }]);
        });

        it('should return status 500 if there is an error', async () => {
            const req = { params: { userid: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            const error = new Error('Error getting cart items');
            Cart.findAll.mockRejectedValue(error);
            
            await getCartItems(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });
});
