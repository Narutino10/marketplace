const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const ProductService = require('../services/productService');

jest.mock('../services/productService');

describe('productController', () => {
    describe('getAllProducts', () => {
        it('should get all products and return status 200', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            ProductService.getProducts.mockResolvedValue([{ id: 1, name: 'Product 1' }]);
            
            await getAllProducts(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Product 1' }]);
        });

        it('should return status 500 if there is an error', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            const error = new Error('Error getting products');
            ProductService.getProducts.mockRejectedValue(error);
            
            await getAllProducts(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Erreur interne du serveur' });
        });
    });

    describe('getProductById', () => {
        it('should get a product by id and return status 200', async () => {
            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            ProductService.getProductById.mockResolvedValue({ id: 1, name: 'Product 1' });
            
            await getProductById(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Product 1' });
        });

        it('should return status 404 if product is not found', async () => {
            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            ProductService.getProductById.mockResolvedValue(null);
            
            await getProductById(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Produit non trouvé' });
        });
    });

    // Continue with similar tests for createProduct, updateProduct, deleteProduct
});
