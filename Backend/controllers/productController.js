const Product = require('../services/productService');
const denormalizeProduct = require('../services/denormalizeProduct');
const Media = require('../models/postgres_models/Media');
const multer = require('multer');
const upload = require('../middleware/upload');
const { faker } = require ('@faker-js/faker');
//const ProductPg = require('../models/postgres_models/ProductPg');


async function getAllProducts(req, res) {
    try {
        const products = await Product.getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function getProductById(req, res) {
    const id = req.params.id;
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID invalide' });
    }
    try {
        const product = await Product.getProductById(id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Erreur lors de la récupération du produit :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function createProduct(req, res) {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: 'Erreur lors du téléchargement du fichier' });
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        try {
            const { name, description, category, brand, price, stock_available, status } = req.body;
            const productData = {
                name,
                description,
                category,
                brand,
                price,
                stock_available,
                status,
                images: []
            };

            if (req.files && req.files.length > 0) {
                productData.images = req.files.map(file => file.path);
            }

            const newProduct = await Product.createProduct(productData);
            const productId = newProduct.newSQLProduct.id;

            if (productData.images.length > 0) {
                const mediaData = productData.images.map(path => ({
                    productId,
                    path
                }));
                await Media.bulkCreate(mediaData);
            }

            await denormalizeProduct(newProduct.newSQLProduct.id); // Dénormalisation
            res.status(201).json({
                message: 'Produit créé avec succès',
                product: newProduct,
            });
        } catch (error) {
            console.error('Erreur lors de la création du produit :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    });
}


async function uploadProductImages(req, res) {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: 'Erreur lors du téléchargement du fichier' });
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        try {
            const { productId } = req.body;
            const mediaData = req.files.map(file => ({
                productId,
                path: file.path
            }));

            await Media.bulkCreate(mediaData);
            res.status(201).json({ message: 'Images uploadées avec succès' });
        } catch (error) {
            console.error('Erreur lors de l\'upload des images :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    });
}


async function updateProduct(req, res) {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Erreur lors du téléchargement du fichier' });
        } else if (err) {
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        try {
            const productId = req.params.id.replace(/^(0+)/g, '');
            console.log(productId);
            const { name, description, category, brand, price, stock_available, status } = req.body;
            const updateData = {
                name,
                description,
                category,
                brand,
                price,
                stock_available,
                status,
                images: []
            };

            if (req.files && req.files.length > 0) {
                updateData.images = req.files.map(file => file.path);
            }

            const updatedProduct = await Product.updateProduct(productId, updateData);
            console.log(updateData, 'dataupdated')
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
            await denormalizeProduct(updatedProduct.updatedSQLProduct.id); // Dénormalisation
            res.status(200).json({ message: 'Produit mis à jour avec succès', product: updatedProduct });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du produit :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    });
}

async function deleteProduct(req, res) {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function searchProducts(req, res) {
    try {
        const { name, category, brand, minPrice, maxPrice } = req.query;
        const criteria = {};
        if (name) criteria.name = { $regex: new RegExp(name, 'i') };
        if (category) criteria.category = category;
        if (brand) criteria.brand = brand;
        if (minPrice && maxPrice) criteria.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };

        const products = await Product.searchProducts(criteria);
        res.status(200).json(products);
    } catch (error) {
        console.error('Erreur lors de la recherche de produits :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function getProductsByCategory(req, res) {
    try {
        const category = req.params.category;
        const products = await Product.getProductsByCategory(category);
        res.status(200).json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits par catégorie :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function updateProductStock(req, res) {
    try {
        const productId = req.params.id;
        const stock = req.body.stock_available;

        const updatedProduct = await Product.updateProductStock(productId, { stock_available: stock });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        await denormalizeProduct(updatedProduct.updatedSQLProduct.id);
        res.status(200).json({ message: 'Stock du produit mis à jour avec succès', product: updatedProduct });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du stock du produit :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function injectProducts(req, res) {
    try {
        for (let i = 0; i < 20; i++) {
            const productData = {
                name: faker.commerce.productName(),
                description: faker.lorem.paragraph(),
                category: faker.commerce.department(),
                brand: faker.company.name(),
                price: parseFloat(faker.commerce.price()),
                stock_available: faker.number.int({ min: 1, max: 100 }),
                status: 'available',
                images: ['/Users/yassineboulahnine/Desktop/Projects/marketplace/logoMammba.png']
            };

            // Appeler la fonction createProduct pour créer le produit
            await Product.createProduct(productData);
            console.log(`Produit ajouté: ${productData.name}`);
        }

        console.log('20 produits ont été ajoutés à la base de données.');
        res.status(200).json({ message: '20 produits ont été ajoutés à la base de données.' });
    } catch (error) {
        console.error('Erreur lors de l\'injection des produits:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

module.exports = {
    updateProductStock,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByCategory,
    uploadProductImages,
    injectProducts
};
