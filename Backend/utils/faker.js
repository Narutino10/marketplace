import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import sequelize from '../config/postgres';
import ProductMongo from '../models/mongo_models/Product';
import ProductPg from '../models/postgres_models/ProductPg';
import denormalizeProduct from '../services/denormalizeProduct';
import '../config/mongodb'; // S'assure que la connexion MongoDB est établie

async function injectProducts() {
    try {
        await sequelize.sync();

        for (let i = 0; i < 20; i++) {
            const productData = {
                name: faker.commerce.productName(),
                description: faker.lorem.paragraph(),
                category: faker.commerce.department(),
                brand: faker.company.name(),
                price: parseFloat(faker.commerce.price()),
                stock_available: faker.number.int({ min: 1, max: 100 }), // Utilise la méthode mise à jour
                status: 'available',
                images: ['uploads/default-product-image.png']
            };

            // Création du produit dans PostgreSQL
            const sqlProduct = await ProductPg.create({
                name: productData.name,
                description: productData.description,
                category: productData.category,
                brand: productData.brand,
                price: productData.price,
                stock_available: productData.stock_available,
                status: productData.status,
                image: JSON.stringify(productData.images)
            });

            // Dénormalisation et création dans MongoDB
            await denormalizeProduct(sqlProduct.id);

            console.log(`Produit ajouté: ${productData.name}`);
        }

        console.log('20 produits ont été ajoutés à la base de données.');
    } catch (error) {
        console.error('Erreur lors de l\'injection des produits:', error);
    } finally {
        await mongoose.disconnect();
        await sequelize.close();
    }
}

export default injectProducts;
