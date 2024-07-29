const ProductSQL = require('../models/postgres_models/ProductPg');
const ProductMongo = require('../models/mongo_models/Product');
const denormalizeProduct = require('../services/denormalizeProduct');

class ProductService {
    static async getProducts() {
        const sqlProducts = await ProductSQL.getProducts();
        const mongoProducts = await ProductMongo.find();

        return { sqlProducts, mongoProducts };
    }

    static async getProductById(productId) {
        //const sqlProduct = await ProductSQL.getProductById(productId);
        const Product = await ProductMongo.findById(productId);
        return Product;
    }

    static async getProductsByIds(productIds) {
        const paddedProductIds = productIds.map(id => id.toString().padStart(24, '0'));
        return await ProductMongo.find({ _id: { $in: paddedProductIds } });
    }

    static async createProduct(productData) {
        try {
            console.log('Tentative de création de produit:', productData);
            const newSQLProduct = await ProductSQL.createProduct(productData);
            console.log('Produit créé dans PostgreSQL:', newSQLProduct);

            // Dénormaliser et créer dans MongoDB
            await denormalizeProduct(newSQLProduct.id);

            return { newSQLProduct };
        } catch (error) {
            console.error('Erreur dans le service lors de la création du produit:', error);
            throw error;
        }
    }

    static async updateProduct(productId, updateData) {
        try {
            const updatedSQLProduct = await ProductSQL.updateProduct(productId, updateData);

            // Dénormaliser et mettre à jour dans MongoDB
            await denormalizeProduct(updatedSQLProduct.id);

            return { updatedSQLProduct };
        } catch (error) {
            throw error;
        }
    }

    static async deleteProduct(productId) {
        try {
            const parsedId = parseInt(productId, 10);
            if (isNaN(parsedId)) {
                throw new Error('Invalid product ID');
            }
            const deletedSQLProduct = await ProductSQL.deleteProduct(parsedId);

            // Supprimer également dans MongoDB
            await ProductMongo.findByIdAndDelete(productId);

            return { deletedSQLProduct };
        } catch (error) {
            throw error;
        }
    }

    static async searchProducts(criteria) {
        const sqlProducts = await ProductSQL.searchProducts(criteria);
        const mongoProducts = await ProductMongo.find(criteria);
        return { sqlProducts, mongoProducts };
    }

    static async getProductsByCategory(category) {
        const sqlProducts = await ProductSQL.getProductsByCategory(category);
        const mongoProducts = await ProductMongo.find({ category });
        return { sqlProducts, mongoProducts };
    }

    static async updateProductStock(productId, newStock) {
        try {
            const updatedSQLProduct = await ProductSQL.updateProductStock(productId, newStock);

            // Dénormaliser et mettre à jour le stock dans MongoDB
            await ProductMongo.findByIdAndUpdate(
                productId,
                { stock_available: newStock },
                { new: true }
            );

            return { updatedSQLProduct };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductService;
