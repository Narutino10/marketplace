const { createAddress } = require('../controllers/AdresseController');
const DeliveryAddressService = require('../services/DeliveryAdress');

jest.mock('../services/DeliveryAdress');

describe('AdresseController', () => {
    describe('createAddress', () => {
        it('should create an address and return status 201', async () => {
            const req = { body: { userId: 1, address: '123 Street' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            DeliveryAddressService.createAddress.mockResolvedValue({ id: 1, address: '123 Street' });
            
            await createAddress(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, address: '123 Street' });
        });

        it('should return status 500 if there is an error', async () => {
            const req = { body: { userId: 1, address: '123 Street' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            const error = new Error('Error creating address');
            DeliveryAddressService.createAddress.mockRejectedValue(error);
            
            await createAddress(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });
});
