const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const Order = require('./Commande');
const Product = require('./ProductPg');

const OrderDetails = sequelize.define('OrderDetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Orders',
            key: 'id',
        },
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Product',
            key: 'id',
        },
        allowNull: false,
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productDescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productCategory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productBrand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'OrderDetails',
    timestamps: true,
});

OrderDetails.belongsTo(Order, { foreignKey: 'orderId' });
OrderDetails.belongsTo(Product, { foreignKey: 'productId' });

Order.hasMany(OrderDetails, { foreignKey: 'orderId' });
Product.hasMany(OrderDetails, { foreignKey: 'productId' });

module.exports = OrderDetails;