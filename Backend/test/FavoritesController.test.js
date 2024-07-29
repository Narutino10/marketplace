const { addFavorite, removeFavorite } = require('../controllers/FavoritesController');
const favoriteService = require('../services/FavoriteService');

jest.mock('../services/FavoriteService');

describe('FavoritesController', () => {
    describe('addFavorite', () => {
        it('should add a favorite and return status 201', async () => {
            const req = { body: { userId: 1, productId: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            favoriteService.addFavorite.mockResolvedValue({ id: 1, userId: 1, productId: 1 });

            await addFavorite(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, userId: 1, productId: 1 });
        });

        it('should return status 500 if there is an error', async () => {
            const req = { body: { userId: 1, productId: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            const error = new Error('Error adding favorite');
            favoriteService.addFavorite.mockRejectedValue(error);

            await addFavorite(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error adding favorite' });
        });
    });

    describe('removeFavorite', () => {
        it('should remove a favorite and return status 200', async () => {
            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            favoriteService.removeFavorite.mockResolvedValue({ id: 1 });

            await removeFavorite(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 1 });
        });

        it('should return status 500 if there is an error', async () => {
            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            const error = new Error('Error removing favorite');
            favoriteService.removeFavorite.mockRejectedValue(error);

            await removeFavorite(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error removing favorite' });
        });
    });
});
