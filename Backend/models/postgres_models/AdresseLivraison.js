const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const User = require('../postgres_models/UserPg');

const DeliveryAddress = sequelize.define('DeliveryAddress', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postalcode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userid: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
},{
    tableName: 'DeliveryAdress',
    timestamps: false,});

DeliveryAddress.belongsTo(User, { foreignKey: 'userid' });

module.exports = DeliveryAddress;
