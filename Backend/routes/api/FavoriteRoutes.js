const express = require('express');
const router = express.Router();
const tokenJWT = require('../../middleware/tockenJWT');
//const { getFavorites } = require('../../controllers/FavoritesController');
const FavoriteController = require('../../controllers/FavoritesController');

router.get('/favorites/:id', tokenJWT, FavoriteController.getFavorites);

module.exports = router;