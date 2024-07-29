const { createReturn, getReturn, updateReturnStatus, listReturnsByUser } = require('../controllers/ReturnsController');
const returnService = require('../services/RetourService');

jest.mock('../services/RetourService');

describe('ReturnsController', () => {
    describe('createReturn', () => {
        it('should create a return and return status 201', async () => {
            const req = { body: { userId: 1, productId: 1, reason: 'Damaged' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            returnService.createReturn.mockResolvedValue({ id: 1, userId: 1, productId: 1, reason: 'Damaged' });
            
            await createReturn(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, userId: 1, productId: 1, reason: 'Damaged' });
        });

        it('should call next with an error if createReturn fails', async () => {
            const req = { body: { userId: 1, productId: 1, reason: 'Damaged' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            const error = new Error('Error creating return');
            returnService.createReturn.mockRejectedValue(error);
            
            await createReturn(req, res, next);
            
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getReturn', () => {
        it('should get a return by id and return status 200', async () => {
            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            returnService.getReturnById.mockResolvedValue({ id: 1, userId: 1, productId: 1, reason: 'Damaged' });
            
            await getReturn(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 1, userId: 1, productId: 1, reason: 'Damaged' });
        });

        it('should call next with an error if getReturnById fails', async () => {
            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            const error = new Error('Error getting return');
            returnService.getReturnById.mockRejectedValue(error);
            
            await getReturn(req, res, next);
            
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    // Continue with similar tests for updateReturnStatus and listReturnsByUser
});
