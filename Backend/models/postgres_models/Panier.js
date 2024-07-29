const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const Client = require('./UserPg');
const Product = require('./ProductPg');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Clients',
            key: 'id'
        }
    },
    productid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Product',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    sessionId: {
    type: DataTypes.STRING,
        allowNull: true,
},
    reservedUntil: {
    type: DataTypes.DATE,
        allowNull: false,
},
}, {
    tableName: 'Cart',
    timestamps: false,
});

// Définition des associations
Cart.belongsTo(Client, { foreignKey: 'userid' });
Cart.belongsTo(Product, { foreignKey: 'productid' });

Client.hasMany(Cart, { foreignKey: 'userid' });
Cart.belongsTo(Client, { foreignKey: 'userid' });

module.exports = Cart;