const express = require('express');
const router = express.Router();
const DeliveryAddressController = require('../../controllers/AdresseController');
const { authenticateToken, authenticateAdmin } = require('../../middleware/authAdmin');

router.post('/', authenticateToken,DeliveryAddressController.createAddress);
router.get('/:addressId',authenticateToken, DeliveryAddressController.getAddressById);
router.put('/:addressId', authenticateToken,DeliveryAddressController.updateAddress);
router.delete('/:addressId', authenticateToken,DeliveryAddressController.deleteAddress);
router.get('/users/:userId/addresses', authenticateToken,DeliveryAddressController.getAddressesByUserId);

module.exports = router;
