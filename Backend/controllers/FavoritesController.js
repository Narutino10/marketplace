const Favorite = require('../models/postgres_models/Favorite');
const Client = require('../models/postgres_models/UserPg');
const Product = require('../models/postgres_models/ProductPg');


exports.addFavorite = async (req, res) => {

    try {
        const { userid, productids } = req.body;

        const client = await Client.findByPk(userid);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        for (const productid of productids) {
            console.log(productid)
            const product = await Product.findByPk(productid);
            console.log('le produit récupéré', product);
            if (!product) {
                return res.status(404).json({ message: `Product with id ${productid} not found` });
            }
        }


        const favorite = await Favorite.create({ userid, productids });
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// controllers/favoriteController.js


exports.getFavorites = async (req, res) => {
    try {
        const { userid } = req.params;
        const favorite = await Favorite.findOne({ where: { userid } });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorites not found' });
        }

        // Récupération des produits favoris
        const products = await Product.findAll({ where: { id: favorite.productids } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.removeFavorite = async (req, res) => {
    try {
        const { userid, productid } = req.body;

        const favorite = await Favorite.findOne({ where: { userid } });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        // Retirer le produit de la liste des favoris
        const index = favorite.productids.indexOf(productid);
        if (index > -1) {
            favorite.productids.splice(index, 1);
            await favorite.save();
        }

        res.status(204).json({ message: 'Favorite removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};