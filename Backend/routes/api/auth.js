const express = require('express');
const router = express.Router();
const authControllers = require('../../controllers/AuthController');
const { authenticateToken, authenticateAdmin } = require('../../middleware/authAdmin');

// Routes publiques d'authentification
router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
//router.post('/refresh-token', authControllers.refresh);
router.post('/refresh-token', authControllers.refreshToken);
router.post('/forgot-password', authControllers.requestPasswordReset);
router.patch('/reset-password', authControllers.resetPassword);
router.get('/confirm-email/:token', authControllers.confirmEmail);

// Routes protégées (nécessitant une authentification)
//router.use(authenticateToken);

router.post('/logout', authenticateToken, authControllers.logout);
router.get('/me',authenticateToken, authControllers.user);
router.get('/users',authenticateToken, authControllers.users);

router.patch('/user/:id', authenticateToken, authControllers.updateUser);

module.exports = router;