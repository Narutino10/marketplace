const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

class Return extends Model {}

Return.init({
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Orders',
            key: 'id'
        },
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Product',
            key: 'id'
        },
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Clients',
            key: 'id'
        },
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Return',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Return;
