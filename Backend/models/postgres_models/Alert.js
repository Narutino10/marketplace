const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const User = require('../mongo_models/User');
const Product = require('../mongo_models/Product');

const Alert = sequelize.define('Alert', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    alert_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Alert.belongsTo(User, { foreignKey: 'user_id' });
Alert.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Alert;
