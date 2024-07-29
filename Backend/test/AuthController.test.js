const { register, login } = require('../controllers/AuthController');
const User = require('../models/postgres_models/UserPg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../services/mailer');

jest.mock('../models/postgres_models/UserPg');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('../services/mailer');

describe('AuthController', () => {
    describe('register', () => {
        it('should register a new user and return status 201', async () => {
            const req = {
                body: {
                    role: 'user',
                    email: 'test@example.com',
                    lastName: 'Doe',
                    firstName: 'John',
                    password: 'password123',
                    password_confirm: 'password123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            const hashedPassword = 'hashedpassword';
            bcrypt.hash.mockResolvedValue(hashedPassword);
            User.create.mockResolvedValue({ id: 1, email: 'test@example.com' });
            sendEmail.mockResolvedValue();

            await register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur créé avec succès. Veuillez vérifier votre email pour confirmer votre inscription.' });
        });

        it('should return status 422 if passwords do not match', async () => {
            const req = {
                body: {
                    role: 'user',
                    email: 'test@example.com',
                    lastName: 'Doe',
                    firstName: 'John',
                    password: 'password123',
                    password_confirm: 'password124'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            await register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({ message: 'Les mots de passe ne correspondent pas' });
        });
    });

    describe('login', () => {
        it('should login a user and return status 200', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                cookie: jest.fn()
            };
            const next = jest.fn();

            const user = { id: 1, email: 'test@example.com', password: 'hashedpassword', confirmed: true, role: 'user' };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');

            await login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Bonjour ! Votre utilisateur est connecté',
                accessToken: 'token',
                refreshToken: 'token',
                user,
                redirectTo: '/'
            });
        });

        it('should return status 401 if password is incorrect', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'wrongpassword'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            const user = { id: 1, email: 'test@example.com', password: 'hashedpassword', confirmed: true };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);

            await login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email ou mot de passe incorrect' });
        });
    });
});
