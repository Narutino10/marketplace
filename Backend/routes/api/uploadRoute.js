const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../../middleware/authAdmin');
const upload = require('../../middleware/upload');
const productControllers = require('../../controllers/ProductController');

// Route protégée (authentification admin requise) pour l'upload des images
router.post('/upload', authenticateAdmin, productControllers.uploadProductImages);

module.exports = router;
