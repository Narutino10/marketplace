'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config.json'))[env];
const db = {};

const denormalizeProduct = require('../services/denormalizeProduct');

const { Product: ProductMongo } = require('../models/mongo_models/Product');

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Lire tous les fichiers de modèles et les importer dans Sequelize
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 && // Ignorer les fichiers cachés
            file !== basename && // Ignorer ce fichier
            file.slice(-3) === '.js' && // Importer uniquement les fichiers .js
            file.indexOf('.test.js') === -1 // Ignorer les fichiers de test
        );
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// Associer les modèles s'ils ont une fonction associate
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
    // Ajouter des hooks pour la dénormalisation des produits
    if (modelName === 'ProductPg') {
        db[modelName].afterCreate(async (product, options) => {
            await denormalizeProduct(product.id, db);
        });
        db[modelName].afterUpdate(async (product, options) => {
            await denormalizeProduct(product.id, db);
        });
        db[modelName].afterDestroy(async (product, options) => {
            await ProductMongo.findByIdAndDelete(product.id);
        });
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
