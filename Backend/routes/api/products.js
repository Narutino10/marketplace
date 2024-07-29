const express = require('express');
const router = express.Router();
const productControllers = require('../../controllers/ProductController');
const { authenticateAdmin, authenticateToken } = require('../../middleware/authAdmin');
const upload = require('../../middleware/upload');

// Routes publiques
router.get('/', productControllers.getAllProducts);
router.get('/search', productControllers.searchProducts);
router.get('/:id', productControllers.getProductById);

// Routes protégées (authentification admin requise)
router.post('/', authenticateAdmin,productControllers.createProduct);
//router.post('/upload', authenticateAdmin, upload, productControllers.uploadProductImages);
router.put('/:id', authenticateAdmin, productControllers.updateProduct);
router.delete('/:id', authenticateAdmin, productControllers.deleteProduct);
router.patch('/:id/stock', authenticateAdmin, productControllers.updateProductStock);

router.post('/inject-products', productControllers.injectProducts);


module.exports = router;
